import { IsDate, IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class SignupDto {
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

  @IsString()
  phoneNumber: string;

  @IsString()
  gender: string;

  @IsDate()
  birthDate: string;

  @IsUrl()
  avatar: string;

  @IsString()
  lattitude: string;

  @IsString()
  longitude: string;
}
