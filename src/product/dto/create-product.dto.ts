import { Category } from '@prisma/client';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ImageInfo } from '../types';

export class CreateProductDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsUUID(4)
  @IsString()
  authorId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  currencyId: string;

  @IsNotEmpty()
  @IsBoolean()
  isAvailable: boolean;

  @IsNotEmpty()
  imageInfo: ImageInfo[];

  @IsNotEmpty()
  category: Category;
}
