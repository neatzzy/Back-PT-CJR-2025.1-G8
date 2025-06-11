import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';
import { PrismaService } from '../prisma/prisma.service';
import e from "express";

@Injectable()
export class AvaliacaoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAvaliacaoDto: CreateAvaliacaoDto) {
    const { usuarioID, professorID, disciplinaID, conteudo, comentarios } = createAvaliacaoDto;

    // Monta o objeto de dados para o Prisma
    const data: any = {
      usuarioID,
      professorID,
      disciplinaID,
      conteudo,
    };

    // Se houver comentários, prepara para criar em cascata
    if (comentarios && comentarios.length > 0) {
      data.comentarios = {
        create: comentarios,
      };
    }

    return await this.prisma.avaliacao.create({ data });
  }

  async findAll() {
    return await this.prisma.avaliacao.findMany({
      select: {
        id: true,
        usuarioID: true,
        professorID: true,
        disciplinaID: true,
        conteudo: true,
        usuario: true,
        professor: true,
        disciplina: true,
        comentarios: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} avaliacao`;
  }

  update(id: number, updateAvaliacaoDto: UpdateAvaliacaoDto) {
    return `This action updates a #${id} avaliacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} avaliacao`;
  }
}
