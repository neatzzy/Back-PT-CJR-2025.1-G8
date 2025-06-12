import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { AvaliacaoEntity } from "src/avaliacao/entities/avaliacao.entity";
import { ProfessorDisciplinaEntity} from "src/professor-disciplina/entities/professor-disciplina.entity";
export class ProfessorEntity {
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  departamento: string;

  disciplinas: ProfessorDisciplinaEntity[];
  Avaliacao: AvaliacaoEntity[];

  createdAt: Date;
  updatedAt: Date;
}
