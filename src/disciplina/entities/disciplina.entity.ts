import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { AvaliacaoEntity } from "src/avaliacao/entities/avaliacao.entity";
import { ProfessorDisciplinaEntity } from "src/professor-disciplina/entities/professor-disciplina.entity";
export class DisciplinaEntity {
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  nome: string;

  professores: ProfessorDisciplinaEntity[];
  Avaliacao: AvaliacaoEntity[];

  createdAt: Date;
  updatedAt: Date;
}
