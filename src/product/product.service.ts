import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { CreateProductDto, ProductDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Product, ProductImage } from '@prisma/client';
import { FOLDERS } from 'src/file-system/cloudinary/constants';
import { FileSystemService } from 'src/file-system/file-system.service';
import { ImageInfo, ProductAndProductImage } from './types';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private fileSystemService: FileSystemService,
  ) {}

  async getProduct(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async createProduct(body: CreateProductDto): Promise<ProductDto> {
    const { id, imageInfo, ...data } = body;
    let createdImages: ImageInfo[] = [];

    const createProduct = await this.prisma.product.create({ data });

    for (const image of imageInfo) {
      const renamedFile: UploadApiResponse =
        await this.fileSystemService.renameFile(image.publicId);

      if (renamedFile) {
        const newImage = {
          publicId: renamedFile.public_id,
          productId: createProduct.id,
          url: renamedFile.secure_url,
        };

        const createProductImage: ProductImage =
          await this.prisma.productImage.create({
            data: newImage as Prisma.ProductImageCreateInput,
          });
        createdImages.push(createProductImage);
      }
    }
    const product = Object.assign({}, createProduct, {
      imageInfo: createdImages,
    });

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
  // async updateProduct(
  //   productId: string,
  //   body: Partial<UpdateProductDto>,
  // ): Promise<Product> {
  //   const product = await this.productRepository.findOne({
  //     where: { productId },
  //   });
  //   if (!product) {
  //     throw new NotFoundException('Product not found.');
  //   }
  //   const _body = new Object({});
  //   if (body.title) {
  //     Object.assign(_body, { title: body.title });
  //   }
  //   if (body.description) {
  //     Object.assign(_body, { description: body.description });
  //   }
  //   if (body.price) {
  //     Object.assign(_body, { price: body.price });
  //   }
  //   const update = await this.productRepository.update(_body, {
  //     where: { productId },
  //   });
  //   const updatedProduct = await this.productRepository.findOne({
  //     where: { productId },
  //   });
  //   if (update[0] < 1 || !updatedProduct) {
  //     throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  //   }
  //   return updatedProduct;
  // }
  async deleteProduct(id: string): Promise<Product> {
    try {
      const products: ProductAndProductImage[] = await this.prisma
        .$queryRaw`SELECT product.id as productId, productimage.id as productImageId, productimage.publicId FROM product INNER JOIN productimage ON product.id = productimage.productId`;

      if (!products) {
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
          products.map((product) => product.publicId),
        );

      const deletedProduct = await this.prisma.product.delete({
        where: { id },
      });
      if (
        deleteImages.count < 1 ||
        !deleteImagesCloudinary ||
        !deletedProduct
      ) {
        throw new HttpException(
          'Product or Images is/are not deleted',
          HttpStatus.BAD_REQUEST,
        );
      }
      return deletedProduct;
    } catch (e) {
      console.log(e);
    }
  }

  // async getUserProducts(userId: string): Promise<Product[]> {
  //   const user = await this.userService.getUserById(userId);
  //   const products = await this.productRepository.findAll({
  //     where: {
  //       userId,
  //     },
  //   });
  //   return products;
  // }
  // private async getProductById(productId: string): Promise<Product> {
  //   const product = await this.productRepository.findOne({
  //     where: { productId },
  //   });
  //   if (!product) {
  //     throw new NotFoundException('Product not found.');
  //   }
  //   return product;
  // }

  async getCurrencyList() {
    return this.prisma.currency.findMany();
  }
}
