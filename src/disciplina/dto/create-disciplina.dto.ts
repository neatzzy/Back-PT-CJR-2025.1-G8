import { DisciplinaEntity } from './../entities/disciplina.entity';
import { PartialType } from '@nestjs/mapped-types';

export class CreateDisciplinaDto extends PartialType(DisciplinaEntity){}
