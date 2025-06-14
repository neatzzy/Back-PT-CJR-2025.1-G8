import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUsuarioDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    senha: string;
}