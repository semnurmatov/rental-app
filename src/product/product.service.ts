import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, ProductDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category, Prisma, Product, ProductImage } from '@prisma/client';
import { FOLDERS } from 'src/file-system/cloudinary/constants';
import { FileSystemService } from 'src/file-system/file-system.service';
import { CreateCategory, ImageInfo } from './types';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private fileSystemService: FileSystemService,
  ) {}

  async getProduct(id: string): Promise<ProductDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    const productImage: ProductImage[] =
      await this.prisma.productImage.findMany({
        where: { productId: product.id },
      });

    const productCategory = await this.prisma.productCategory.findFirst({
      where: { productId: product.id },
      include: {
        category: {
          select: {
            id: true,
            title: true,
            parentId: true,
          },
        },
      },
    });

    const productDto: ProductDto = Object.assign(
      {},
      product,
      { imageInfo: productImage },
      { category: productCategory.category },
    );

    return productDto;
  }

  async getAllProducts(): Promise<ProductDto[]> {
    const products = await this.prisma.product.findMany();

    return this.getProductImageAndCategory(products);
  }

  async getProductsWithOffset(
    offset?: number,
    limit?: number,
  ): Promise<ProductDto[]> {
    let products: Product[];

    products = await this.prisma.product.findMany({
      skip: offset,
      take: limit,
    });

    return this.getProductImageAndCategory(products);
  }

  async searchProducts(search: string, offset?: number, limit?: number) {
    const products = await this.prisma.product.findMany({
      skip: offset,
      take: limit,
      where: {
        OR: [
          {
            title: {
              contains: search,
            },
          },
          {
            description: {
              contains: search,
            },
          },
        ],
      },
    });

    return this.getProductImageAndCategory(products);
  }

  async createProduct(body: CreateProductDto): Promise<ProductDto> {
    const { id, imageInfo, category, ...data } = body;

    const createProduct = await this.prisma.product.create({ data });

    const productCategory = await this.prisma.productCategory.create({
      data: { productId: createProduct.id, categoryId: category.id },
    });

    const createdImages = await this.imagesFromTempToProduct(
      createProduct.id,
      imageInfo,
    );

    const product: ProductDto = Object.assign(
      {},
      createProduct,
      {
        imageInfo: createdImages,
      },
      {
        category: category,
      },
    );

    return product;
  }

  async uploadMultipleProductImages(
    files: Array<Express.Multer.File>,
  ): Promise<ImageInfo[]> {
    let imageData: ImageInfo[] = [];

    for (const file of files) {
      const image = await this.fileSystemService.uploadFile(file, FOLDERS.TEMP);

      const data = {
        url: image.secure_url,
        publicId: image.public_id,
      } as ImageInfo;

      imageData.push(data);
    }

    return imageData;
  }

  async uploadProductImage(file: Express.Multer.File): Promise<ImageInfo> {
    const image = await this.fileSystemService.uploadFile(file, FOLDERS.TEMP);

    return {
      url: image.secure_url,
      publicId: image.public_id,
    } as ImageInfo;
  }

  async deleteTempImage(imageInfo: ImageInfo) {
    const deleteImage = await this.fileSystemService.deleteFile(
      imageInfo.publicId,
    );
    if (!deleteImage) {
      throw new BadRequestException();
    }
    return imageInfo;
  }

  async deleteTempImages(imagesInfo: ImageInfo[]) {
    const imagesIds = imagesInfo.map((imageInfo) => imageInfo.publicId);

    return this.fileSystemService.deleteMultipleFile(imagesIds);
  }

  async updateProduct(body: ProductDto): Promise<ProductDto> {
    const product = await this.prisma.product.findUnique({
      where: { id: body.id },
    });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }
    const _body: Prisma.ProductUpdateInput = new Object({});
    if (body.title && body.title !== product.title) {
      Object.assign(_body, { title: body.title });
    }
    if (body.description && body.description !== product.description) {
      Object.assign(_body, { description: body.description });
    }
    if (body.price && body.price !== product.price) {
      Object.assign(_body, { price: body.price });
    }
    if (body.isAvailable !== product.isAvailable) {
      Object.assign(_body, { isAvailable: body.isAvailable });
    }
    if (body.currencyId && body.currencyId !== product.currencyId) {
      Object.assign(_body, { currencyId: body.currencyId });
    }

    if (body.category) {
      await this.updateCategoryOfProduct(body.id, body.category);
    }

    if (body.imageInfo) {
      await this.imagesFromTempToProduct(product.id, body.imageInfo);
    }
    const updatedProduct: Product = await this.prisma.product.update({
      data: _body,
      where: { id: body.id },
    });

    if (!updatedProduct) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }

    return this.getProduct(body.id);
  }

  async deleteProduct(id: string): Promise<Product> {
    try {
      // const products: ProductAndProductImage[] = await this.prisma
      //   .$queryRaw`SELECT product.id as productId, productimage.id as productImageId, productimage.publicId FROM product INNER JOIN productimage ON product.id = productimage.productId`;

      const product = await this.prisma.product.findUnique({
        where: { id },
        select: {
          id: true,
          productImages: {
            select: {
              id: true,
              publicId: true,
              url: true,
            },
          },
        },
      });
      if (!product) {
        throw new NotFoundException('Product not found.');
      }
      const deleteImages: Prisma.BatchPayload =
        await this.prisma.productImage.deleteMany({
          where: {
            productId: id,
          },
        });

      const deleteImagesCloudinary =
        await this.fileSystemService.deleteMultipleFile(
          product.productImages.map((image) => image.publicId),
        );

      const deleteProductCategory =
        await this.prisma.productCategory.deleteMany({
          where: { productId: id },
        });

      const deletedProduct = await this.prisma.product.delete({
        where: { id },
      });
      if (
        deleteImages.count < 1 ||
        !deleteImagesCloudinary ||
        !deletedProduct ||
        !deleteProductCategory
      ) {
        throw new HttpException(
          'Product, Product Category or Images is/are not deleted',
          HttpStatus.BAD_REQUEST,
        );
      }
      return deletedProduct;
    } catch (e) {
      console.log(e);
    }
  }

  public async imagesFromTempToProduct(
    productId: string,
    imageInfo: ImageInfo[],
  ): Promise<ProductImage[]> {
    let createdImages: ProductImage[] = [];

    for (const image of imageInfo) {
      const renamedFile: UploadApiResponse =
        await this.fileSystemService.renameFile(image.publicId);

      if (renamedFile) {
        const newImage = {
          publicId: renamedFile.public_id,
          productId: productId,
          url: renamedFile.secure_url,
        };

        const createProductImage: ProductImage =
          await this.prisma.productImage.create({
            data: newImage as Prisma.ProductImageCreateInput,
          });
        createdImages.push(createProductImage);
      }
    }

    return createdImages;
  }

  async getCurrencyList() {
    return this.prisma.currency.findMany();
  }

  async getCategories(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  /*
  ----  Helper Functions ----
  */

  // Create Category
  async createCategory(createCategory: CreateCategory) {
    const categories = await this.prisma.category.findMany();

    for (const category of categories) {
      if (category.title === createCategory.title) {
        throw new ConflictException('Category with this name already exists.');
      }
    }

    const createCat = await this.prisma.category.create({
      data: createCategory,
    });

    return createCat;
  }

  async updateCategoryOfProduct(productId: string, category: Category) {
    const productCat = await this.prisma.productCategory.findFirst({
      where: { productId: productId },
    });
    console.log('productCat: ', JSON.stringify(productCat));
    console.log('Cat: ', JSON.stringify(category));

    if (category.id !== productCat.categoryId) {
      const updateProductCat = await this.prisma.productCategory.update({
        data: {
          categoryId: category.id,
        },
        where: { id: productCat.id },
      });
      console.log('updateProductCat: ', JSON.stringify(updateProductCat));

      if (!updateProductCat) {
        throw new BadRequestException('Product Category was not updated!');
      }
      return updateProductCat;
    }

    return productCat;
  }

  async getProductImageAndCategory(products: Product[]) {
    const allProducts = [];

    for (const product of products) {
      const productImage: ProductImage[] =
        await this.prisma.productImage.findMany({
          where: { productId: product.id },
        });

      const productCategory = await this.prisma.productCategory.findFirst({
        where: { productId: product.id },
        include: {
          category: {
            select: {
              id: true,
              title: true,
              parentId: true,
            },
          },
        },
      });

      const productDto: ProductDto = Object.assign(
        {},
        product,
        { imageInfo: productImage },
        { category: productCategory.category },
      );

      allProducts.push(productDto);
    }

    return allProducts;
  }
}
