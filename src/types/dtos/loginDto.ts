import { IsEmail, IsString, MinLength } from "class-validator";

export class loginDto {
    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    @MinLength(8)   
    @IsEmail() 
    email: string;
}