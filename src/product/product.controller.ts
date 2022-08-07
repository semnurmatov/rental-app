import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Category, Currency } from '@prisma/client';
import { PaginationParams } from 'src/utils/types';
import { CreateProductDto, ProductDto } from './dto';
import { ProductService } from './product.service';
import { CreateCategory, ImageInfo } from './types';

@Controller('')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/product/:id')
  @HttpCode(HttpStatus.OK)
  public async getProduct(@Param('id') productId: string): Promise<ProductDto> {
    return this.productService.getProduct(productId);
  }

  @Get('/product')
  @HttpCode(HttpStatus.OK)
  public async getAllProducts(): Promise<ProductDto[]> {
    return this.productService.getAllProducts();
  }

  @Get('/product-offset')
  @HttpCode(HttpStatus.OK)
  public async getProductsWithOffset(
    @Query('search') search: string,
    @Query() { offset, limit }: PaginationParams,
  ): Promise<ProductDto[]> {
    if (search) {
      return this.productService.searchProducts(search, offset, limit);
    }
    return this.productService.getProductsWithOffset(offset, limit);
  }

  @Post('/product')
  public async createProduct(@Body() body: CreateProductDto) {
    return this.productService.createProduct(body);
  }

  @Post('/product/image')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    return this.productService.uploadProductImage(file);
  }

  @Post('/product/images')
  @UseInterceptors(AnyFilesInterceptor())
  public async uploadMultipleProductImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.productService.uploadMultipleProductImages(files);
  }

  @Patch('/:productId')
  @HttpCode(HttpStatus.OK)
  public async updateProduct(@Body() body: ProductDto) {
    return this.productService.updateProduct(body);
  }

  @Delete('/product/temp/images')
  @HttpCode(HttpStatus.OK)
  public async deleteTempImages(@Body() imagesInfo: ImageInfo[]) {
    return this.productService.deleteTempImages(imagesInfo);
  }

  @Delete('/product/temp/image')
  public async deteleTempImage(@Body() imageId: ImageInfo) {
    return this.productService.deleteTempImage(imageId);
  }

  @Delete('/product/:productId')
  public async deteleProduct(@Param('productId') productId: string) {
    return this.productService.deleteProduct(productId);
  }

  // // @Get('/user-products/:userId')
  // // @HttpCode(HttpStatus.OK)
  // // public async getUserProducts(@Param('userId') userId: string) {
  // //   return this.productService.getUserProducts(userId);
  // // }

  @Get('/currency-list')
  @HttpCode(HttpStatus.OK)
  public async getCurrencyList(): Promise<Currency[]> {
    return this.productService.getCurrencyList();
  }

  @Get('/categories')
  @HttpCode(HttpStatus.OK)
  public async getCategories(): Promise<Category[]> {
    return this.productService.getCategories();
  }

  /*
  ----  Helper Functions ----
  */

  // Create Category
  @Post('/product/category')
  public async createCategory(@Body() createCategory: CreateCategory) {
    return this.productService.createCategory(createCategory);
  }
}
