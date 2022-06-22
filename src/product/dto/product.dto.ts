import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ImageInfo } from '../types';

export class ProductDto {
  @IsNotEmpty()
  @IsUUID(4)
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsUUID(4)
  @IsString()
  authorId: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  currencyId: string;

  @IsOptional()
  @IsBoolean()
  isAvailable: boolean;

  @IsNotEmpty()
  imageInfo: ImageInfo[];
}
