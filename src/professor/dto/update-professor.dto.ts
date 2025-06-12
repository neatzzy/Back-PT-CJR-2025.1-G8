import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateProfessorDto } from './create-professor.dto';

export class UpdateProfessorDto extends PartialType(CreateProfessorDto) {
    @IsOptional()
    @IsString({ message: 'O nome deve ser uma string.' })
        @IsNotEmpty({ message: 'O campo nome não pode estar vazio.' })
        nome: string;

        @IsOptional()
        @IsString({ message: 'O departamento deve ser uma string.' })
        @IsNotEmpty({ message: 'O campo departamento não pode estar vazio.' })
        departamento: string;

        @IsOptional()
        @IsNotEmpty({ message: 'O campo disciplinas não pode estar vazio.' })
        disciplinas?: any[];

        @IsOptional()
        fotoPerfil?: Buffer;
    
        @IsOptional()
        Avaliacao?: any[]
}
