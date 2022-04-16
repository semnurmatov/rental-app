import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class UpdateProductDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;
}
