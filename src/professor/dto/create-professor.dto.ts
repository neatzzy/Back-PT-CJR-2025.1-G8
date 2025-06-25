import { IsString, IsNotEmpty, IsOptional } from 'class-validator'; 
import { PartialType } from '@nestjs/mapped-types';
import { Professor } from '../entities/professor.entity'; 

export class CreateProfessorDto extends PartialType(Professor) { 
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo nome não pode estar vazio.' })
  nome: string;

  @IsString({ message: 'O departamento deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo departamento não pode estar vazio.' })
  departamento: string;

  @IsString({ message: 'A disciplina deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo disciplina não pode estar vazio.' })
  disciplinaName: string;

  @IsOptional()
  fotoPerfil?: Buffer; 
}