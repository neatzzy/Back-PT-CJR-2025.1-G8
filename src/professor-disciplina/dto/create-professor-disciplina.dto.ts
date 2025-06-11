import { PartialType } from "@nestjs/mapped-types";
import { IsString, IsNotEmpty } from 'class-validator';
import { ProfessorDisciplinaEntity } from "../entities/professor-disciplina.entity";

export class CreateProfessorDisciplinaDto extends PartialType(ProfessorDisciplinaEntity){
    
}
