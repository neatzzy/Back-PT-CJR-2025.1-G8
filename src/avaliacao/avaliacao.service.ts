import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AvaliacaoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAvaliacaoDto: CreateAvaliacaoDto) {
    const { usuarioID, 
      professorID, professorNome,
      disciplinaID, disciplinaNome,
      conteudo, 
      comentarios } = createAvaliacaoDto;

    // Verifica se o usuário existe
    const usuario = await this.prisma.usuario.findUnique({ where: { id: usuarioID } });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    // Verifica se o professor existe, se não, cria
    let professorId = professorID;
    if (professorID) {
      let professor = await this.prisma.professor.findUnique({ where: { id: professorID } });
      
      if (!professor) {
        const dataProfessor: any = {
          nome : professorNome
        };
        
        professor = await this.prisma.professor.create({ dataProfessor });
      }
      
      professorId = professor.id;
    }

    // Verifica se a disciplina existe, se não, cria
    let disciplinaId = disciplinaID;
    if (disciplinaID) {
      let disciplina = await this.prisma.disciplina.findUnique({ where: { id: disciplinaID } });
      if (!disciplina) {
        disciplina = await this.prisma.disciplina.create({ data: { id: disciplinaID } });
      }
      disciplinaId = disciplina.id;
    }

    // Monta o objeto de dados para o Prisma
    const dataAvaliacao: any = {
      usuarioID,
      professorID: professorId,
      disciplinaID: disciplinaId,
      conteudo,
    };

    // Se houver comentários, prepara para criar em cascata
    if (comentarios && comentarios.length > 0) {
      dataAvaliacao.comentarios = {
        create: comentarios,
      };
    }

    return await this.prisma.avaliacao.create({ dataAvaliacao });
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
