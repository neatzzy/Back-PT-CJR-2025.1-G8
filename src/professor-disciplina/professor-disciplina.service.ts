import { Injectable } from '@nestjs/common';
import { CreateProfessorDisciplinaDto } from './dto/create-professor-disciplina.dto';
import { UpdateProfessorDisciplinaDto } from './dto/update-professor-disciplina.dto';

@Injectable()
export class ProfessorDisciplinaService {
  create(createProfessorDisciplinaDto: CreateProfessorDisciplinaDto) {
    return 'This action adds a new professorDisciplina';
  }

  findAll() {
    return `This action returns all professorDisciplina`;
  }

  findOne(id: number) {
    return `This action returns a #${id} professorDisciplina`;
  }

  update(id: number, updateProfessorDisciplinaDto: UpdateProfessorDisciplinaDto) {
    return `This action updates a #${id} professorDisciplina`;
  }

  remove(id: number) {
    return `This action removes a #${id} professorDisciplina`;
  }
}
