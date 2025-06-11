import { ConflictException, Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AvaliacaoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAvaliacaoDto: CreateAvaliacaoDto) {
    const { usuarioID, professorNome, disciplinaNome, conteudo, comentarios } = createAvaliacaoDto;

    // Verifica se o usuário existe (pode ser fora da transação)
    const usuario = await this.prisma.usuario.findUnique({ where: { id: usuarioID } });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    try {
      
      // Tudo dentro da transação!
      return await this.prisma.$transaction(async (tx) => {
        // Verifica/cria professor pelo nome
        let professor = await tx.professor.findFirst({ where: { nome: professorNome } });
        if (!professor) {
          professor = await tx.professor.create({
            data: {
              nome: professorNome,
              departamento: usuario.departamento,
            },
          });
        }
        const professorId = professor.id;

        // Verifica/cria disciplina pelo nome
        let disciplina = await tx.disciplina.findFirst({ where: { nome: disciplinaNome } });
        if (!disciplina) {
          disciplina = await tx.disciplina.create({
            data: {
              nome: disciplinaNome,
            },
          });
        }
        const disciplinaId = disciplina.id;

        // Cria a relação N-N antes da avaliação
        const relacao = await tx.professorDisciplina.findUnique({
          where: {
            professorID_disciplinaID: {
              professorID: professorId,
              disciplinaID: disciplinaId,
            },
          },
        });

        if (!relacao) {
          await tx.professorDisciplina.create({
            data: {
              professorID: professorId,
              disciplinaID: disciplinaId,
            },
          });
        }

        // cria avaliação
        const dataAvaliacao: any = {
          usuarioID,
          professorID: professorId,
          disciplinaID: disciplinaId,
          conteudo,
        };

        if (comentarios && comentarios.length > 0) {
          dataAvaliacao.comentarios = {
            create: comentarios,
          };
        }

        return await tx.avaliacao.create({ data: dataAvaliacao });
      });
    
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        
        // Erro de constraint de chave estrangeira
        if (error.code === 'P2003') {
          throw new BadRequestException({
            message: 'Violação de integridade referencial. Verifique se todos os IDs referenciados existem.',
            prismaError: error.meta,
          });
        }
        
        // Outros erros conhecidos do Prisma
        throw new BadRequestException({
          message: 'Erro Prisma: ' + error.message,
          prismaError: error.meta,
        });
      }
      
      // Outros erros não tratados
      throw new InternalServerErrorException({
        message: 'Erro interno ao criar avaliação.',
        error: error.message,
      });
    }
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
