import { DisciplinaEntity } from './../entities/disciplina.entity';
import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty } from 'class-validator';


export class CreateDisciplinaDto extends PartialType(DisciplinaEntity){
    @IsString()
    @IsNotEmpty()
    nome: string;
}
