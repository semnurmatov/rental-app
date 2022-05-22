import { Gender } from '@prisma/client';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';

export class SignupDto {
  //   @IsOptional()
  //   id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
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
