import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateProfessorDto } from './create-professor.dto';

export class UpdateProfessorDto extends PartialType(CreateProfessorDto) {
    @IsOptional()
    @IsString({ message: 'O nome deve ser uma string.' })
    nome?: string;

    @IsOptional()
    @IsString({ message: 'O departamento deve ser uma string.' })
    departamento?: string;

    @IsOptional()
    @IsString()
    disciplinaName?: string;

    @IsOptional()
    fotoPerfil?: Buffer;
    
    @IsOptional()
    Avaliacao?: any[]
}