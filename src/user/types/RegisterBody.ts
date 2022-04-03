import { IsNotEmpty, IsString } from "class-validator";

export class RegisterBody{
    @IsString()
    @IsNotEmpty()
    readonly username: string;
    @IsString()
    @IsNotEmpty()
    readonly password: string;
    @IsString()
    @IsNotEmpty()
    readonly avatar: string;
    @IsString()
    readonly name: string;
    @IsString()
    readonly surname: string;
    @IsNotEmpty()
    readonly birthDate: Date;
    @IsString()
    readonly gender: string;
}