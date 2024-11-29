import { IsEmail, IsString, MinLength } from "class-validator";

export class registerDto {
    @IsString()
    @MinLength(8)   
    username: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    @MinLength(8)  
    confirmPassword: string;

    @IsString()
    @MinLength(8)   
    @IsEmail() 
    email: string;
}