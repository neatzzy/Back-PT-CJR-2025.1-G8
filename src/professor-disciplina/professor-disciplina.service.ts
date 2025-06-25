import { Injectable } from '@nestjs/common';
import { CreateProfessorDisciplinaDto } from './dto/create-professor-disciplina.dto';
import { UpdateProfessorDisciplinaDto } from './dto/update-professor-disciplina.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class ProfessorDisciplinaService {
  constructor(private prisma: PrismaService) {}
  create(createProfessorDisciplinaDto: CreateProfessorDisciplinaDto) {
    return 'This action adds a new professorDisciplina';
  }

  async findDisciplinasByProfessor(professorId: number, searchTerm?: string) {
    const professorDisciplinas = await this.prisma.professorDisciplina.findMany({
      where: {
        professorID: professorId,
        disciplina: searchTerm
          ? {
              is: {
                nome: {
                  contains: searchTerm,
                },
              },
            }
          : undefined,
      },
      select: {
        disciplina: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      orderBy: {
        disciplina: { nome: 'asc' },
      },
    });

    return professorDisciplinas.map(pd => pd.disciplina);
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
