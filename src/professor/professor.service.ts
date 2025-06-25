import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';

@Injectable()
export class ProfessorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProfessorDto: CreateProfessorDto) {
    const existingProfessor = await this.prisma.professor.findFirst({ where: { nome: createProfessorDto.nome } });
    if (existingProfessor) {
      throw new ConflictException('Este professor já está cadastrado.');
    }

    const data = {
      nome: createProfessorDto.nome,
      departamento: createProfessorDto.departamento ?? '',
      disciplinas: createProfessorDto.disciplinas
        ? { create: createProfessorDto.disciplinas }
        : undefined,
      fotoPerfil: createProfessorDto.fotoPerfil,
    };

    return await this.prisma.professor.create({ data });
    }

  async findAll() {
    return await this.prisma.professor.findMany({
      select: {
        id: true,
        nome: true,
        departamento: true,
        fotoPerfil: true,
        disciplinas: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }


  async findAllsearch(searchTerm?: string) {
    const whereCondition = searchTerm?
       {
          nome: {
            contains: searchTerm, 
            mode: 'insensitive', //IMPORTANTE ignora maiusculas e minusculas
          },
        }
      : {}; 

    return this.prisma.professor.findMany({
      where: whereCondition,
      orderBy: {
        nome: 'asc', 
      },
    });
  }

  async findOne(id: number) {
    const professor =  this.prisma.professor.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        departamento: true,
        createdAt: true,
        updatedAt: true,
        disciplinas: {
          select: {
            disciplina: {
              select: {
                id: true,
                nome: true,
              }
            }
          }
        }
      }
    });

    if(!professor) throw new NotFoundException("Professor com ID ${id} não encontrado");
    return professor;
  }

  async update(id: number, updateProfessorDto: UpdateProfessorDto) {
      const professor = await this.prisma.professor.findUnique({ where: { id } });
      if (!professor) {
        throw new NotFoundException(`Professor com ID ${id} não encontrado`);
      }
      const { id: _id, createdAt, updatedAt, Avaliacao, disciplinas, ...rest } = updateProfessorDto;

      const data: any = { ...rest };
      if (disciplinas) {
        data.disciplinas = { set: disciplinas };
      }

      const updatedProfessor = await this.prisma.professor.update({
        where: { id },
        data,
      });
      return { message: 'Professor atualizado com sucesso', data: updatedProfessor };
    }

    async remove(id: number) {
      const professor = await this.prisma.professor.findUnique({ where: { id } });
      if (!professor) {
        throw new NotFoundException(`Professor com ID ${id} não encontrado`);
      }
      await this.prisma.professor.delete({ where: { id } });
      return { message: `Professor removido com sucesso` };
    }
}
