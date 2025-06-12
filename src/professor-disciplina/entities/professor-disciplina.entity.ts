import { IsInt } from 'class-validator';
import { ProfessorEntity } from 'src/professor/entities/professor.entity';
import { DisciplinaEntity } from 'src/disciplina/entities/disciplina.entity';

export class ProfessorDisciplinaEntity {
  @IsInt()
  professorID: number;

  @IsInt()
  disciplinaID: number;

  professor: ProfessorEntity;
  disciplina: DisciplinaEntity;
}
