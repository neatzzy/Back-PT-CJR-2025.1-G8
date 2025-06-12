import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Professor } from '../entities/professor.entity'
import { PartialType } from '@nestjs/mapped-types';

export class CreateProfessorDto extends PartialType(Professor){
    @IsString({ message: 'O nome deve ser uma string.' })
    @IsNotEmpty({ message: 'O campo nome não pode estar vazio.' })
    nome: string;

    @IsString({ message: 'O departamento deve ser uma string.' })
    @IsNotEmpty({ message: 'O campo departamento não pode estar vazio.' })
    departamento: string;

    @IsNotEmpty({ message: 'O campo disciplinas não pode estar vazio.' })
    disciplinas?: any[];

    @IsOptional()
    fotoPerfil?: Buffer;

    @IsOptional()
    Avaliacao?: any[]
}
