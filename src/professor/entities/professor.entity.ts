import { Avaliacao, professorDisciplina } from "@prisma/client";
import { IsString, IsInt } from "class-validator";
import { DateTime } from "luxon";

export class Professor {
    @IsInt()
    id: number;

    @IsString()
    nome: string;

    @IsString()
    departamento: string;

    createdAt?: DateTime;
    updatedAt?: DateTime;

    disciplinas?: professorDisciplina[];

    Avaliacao?: Avaliacao[];
}