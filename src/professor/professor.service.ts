import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { BufferImageToBase64String } from 'src/utils/functions';
import { appendFile } from 'fs';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProfessorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProfessorDto: CreateProfessorDto) {
    const existingProfessor = await this.prisma.professor.findFirst({
      where: { nome: createProfessorDto.nome },
    });
    if (existingProfessor) {
      throw new ConflictException('Este professor já está cadastrado.');
    }

    const { nome, departamento, disciplinaName, fotoProfessor} = createProfessorDto;
    const data: any = { 
      nome: nome,
      departamento: departamento, 
      fotoPerfil: fotoProfessor, 

      disciplinas: {
        create: {
          disciplina: {
            connectOrCreate: { 
              where: { nome: disciplinaName }, 
              create: { nome: disciplinaName }, 
            },
          },
        },
      },
    };

    return await this.prisma.professor.create({ data: data });
  }

  async findAll(search?: string) { 
    const whereCondition = search 
      ? {
          nome: {
            contains: search
          },
        }
      : {}; 

    return await this.prisma.professor.findMany({
      where: whereCondition, 
      orderBy: {
        nome: 'asc',
      },
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

  async findOne(id: number) {
    const professor = await this.prisma.professor.findUnique({
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
        },
        fotoPerfil : true,
      }
    });

    if(!professor) throw new NotFoundException("Professor com ID ${id} não encontrado");

    return {
      ...professor,
      fotoPerfil : BufferImageToBase64String(professor),
    };
  }

  async update(professorId: number, dto: UpdateProfessorDto) {
    const existing = await this.prisma.professor.findUnique({
      where: { id: professorId },
    });
    if (!existing) {
      throw new NotFoundException(`Professor com ID ${professorId} não encontrado.`);
    }

    const { disciplinaName, nome, departamento, fotoPerfil } = dto;
    const updateData: Prisma.ProfessorUpdateInput = {};

    if (nome) {
      updateData.nome = nome;
    }
    if (departamento) {
      updateData.departamento = departamento;
    }
    if (fotoPerfil) {
      updateData.fotoPerfil = { set: fotoPerfil };
    }
    if (disciplinaName?.trim()) {
      updateData.disciplinas = {
        create: {
          disciplina: {
            connectOrCreate: {
              where: { nome: disciplinaName },
              create: { nome: disciplinaName },
            },
          },
        },
      };
    }

    const updatedProfessor = await this.prisma.professor.update({
      where: { id: professorId },
      data: updateData,
      include: {
        disciplinas: {
          select: {
            disciplina: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    });
    return {
      message: 'Professor atualizado com sucesso',
      data: updatedProfessor,
    };
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
