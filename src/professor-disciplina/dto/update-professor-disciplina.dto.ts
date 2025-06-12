import { PartialType } from '@nestjs/mapped-types';
import { CreateProfessorDisciplinaDto } from './create-professor-disciplina.dto';

export class UpdateProfessorDisciplinaDto extends PartialType(CreateProfessorDisciplinaDto) {}
