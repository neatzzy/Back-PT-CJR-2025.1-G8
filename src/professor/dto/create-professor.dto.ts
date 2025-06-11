import { ProfessorEntity } from "../entities/professor.entity";
import { PartialType } from "@nestjs/mapped-types";

export class CreateProfessorDto extends PartialType(ProfessorEntity){}
