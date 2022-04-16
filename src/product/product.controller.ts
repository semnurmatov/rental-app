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
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  public async createProduct(@Body() body: CreateProductDto) {
    return this.productService.createProduct(body);
  }

  @Patch('/:productId')
  @HttpCode(HttpStatus.OK)
  public async updateProduct(
    @Param('productId') productId: string,
    @Body() body: Partial<UpdateProductDto>,
  ) {
    return this.productService.updateProduct(productId, body);
  }

  @Delete('/:productId')
  public async deteleProduct(@Param('productId') productId: string) {
    return this.productService.deleteProduct(productId);
  }

  @Get('/:productId')
  @HttpCode(HttpStatus.OK)
  public async getProduct(@Param('productId') productId: string) {
    return this.productService.getProduct(productId);
  }

  @Get('/user-products/:userId')
  @HttpCode(HttpStatus.OK)
  public async getUserProducts(@Param('userId') userId: string) {
    return this.productService.getUserProducts(userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAllProducts() {
    return this.productService.getAllProducts();
  }
}
