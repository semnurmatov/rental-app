import { Gender } from '@prisma/client';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsUUID(4)
  @IsString()
  id: string;

  // @IsOptional()
  // email: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  gender: Gender;

  @IsOptional()
  @IsDateString()
  birthDate: string;

  @IsOptional()
  @IsUrl()
  avatar: string;
}
