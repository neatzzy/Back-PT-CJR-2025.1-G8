import {IsEmail, IsOptional, IsString, MinLength, IsNotEmpty} from 'class-validator';
import { PartialType} from '@nestjs/mapped-types';
import { Usuario } from '../entities/usuario.entity';
export class UpdateUsuarioDto extends PartialType(Usuario) {   //documentando o partialtype que torna todos os campos opcionais, para garantir. 
    @IsOptional()
    @IsEmail({}, { message: 'O email fornecido é inválido.' })
    email?: string;

    @IsOptional()
    @IsString({ message: 'A senha deve ser uma string.' })
    @IsNotEmpty({ message: 'O campo senha não pode estar vazio.' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
    senha?: string;

    @IsOptional()
    @IsString()
    nome?:string;
    
    @IsOptional()
    @IsString()
    departamento?: string;

    @IsOptional()
    @IsString()
    curso?: string;

    @IsOptional()
    fotoPerfil?: Buffer; 
}
