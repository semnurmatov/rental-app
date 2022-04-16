import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PRODUCT_PROVIDERS } from './constants';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './product.model';
import * as uuid from 'uuid';
import { UserService } from '../user/user.service';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_PROVIDERS)
    private productRepository: typeof Product,
    private userService: UserService,
  ) {}

  async createProduct(body: CreateProductDto): Promise<Product> {
    const productId = uuid.v4();

    const product: Product = await this.productRepository.create({
      productId,
      userId: body.userId,
      title: body.title,
      description: body.description,
      price: body.price,
    });

    return product;
  }

  async updateProduct(
    productId: string,
    body: Partial<UpdateProductDto>,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    const _body = new Object({});

    if (body.title) {
      Object.assign(_body, { title: body.title });
    }
    if (body.description) {
      Object.assign(_body, { description: body.description });
    }
    if (body.price) {
      Object.assign(_body, { price: body.price });
    }

    const update = await this.productRepository.update(_body, {
      where: { productId },
    });

    const updatedProduct = await this.productRepository.findOne({
      where: { productId },
    });

    if (update[0] < 1 || !updatedProduct) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }

    return updatedProduct;
  }

  async deleteProduct(productId: string): Promise<boolean> {
    const product = await this.productRepository.findOne({
      where: { productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    const isDeleted = await this.productRepository.destroy({
      where: { productId },
    });

    if (isDeleted < 1) {
      return false;
    }

    return true;
  }

  async getProduct(productId: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    const product = await this.productRepository.findAll();

    return product;
  }

  async getUserProducts(userId: string): Promise<Product[]> {
    const user = await this.userService.getUserById(userId);

    const products = await this.productRepository.findAll({
      where: {
        userId,
      },
    });

    return products;
  }

  private async getProductById(productId: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return product;
  }
}
