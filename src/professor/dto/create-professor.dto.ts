import { ProfessorEntity } from "../entities/professor.entity";
import { PartialType } from "@nestjs/mapped-types";
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProfessorDto extends PartialType(ProfessorEntity){

}
