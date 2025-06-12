import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateProfessorDto } from './create-professor.dto';
import { DateTime } from 'luxon';

export class UpdateProfessorDto extends PartialType(CreateProfessorDto) {
    @IsString({ message: 'O nome deve ser uma string.' })
        @IsNotEmpty({ message: 'O campo nome não pode estar vazio.' })
        nome: string;
    
        @IsString({ message: 'O departamento deve ser uma string.' })
        @IsNotEmpty({ message: 'O campo departamento não pode estar vazio.' })
        departamento: string;
    
        @IsNotEmpty({ message: 'O campo disciplinas não pode estar vazio.' })
        disciplinas?: any[];
    
        @IsOptional()
        Avaliacao?: any[]
}
