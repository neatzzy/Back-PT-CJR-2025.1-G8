import { Usuario } from 'src/usuario/entities/usuario.entity';
import { ConflictException, Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { FindAllAvaliacoesDto } from './dto/find-all-avaliacoes.dto';
import { handlePrismaError } from 'src/config/ErrorPrisma';
import { BufferImageToBase64String } from 'src/utils/functions';

@Injectable()
export class AvaliacaoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAvaliacaoDto: CreateAvaliacaoDto) {
    const {userId, professorId, disciplinaId, conteudo, comentarios } = createAvaliacaoDto;

    // Verifica se o usuário existe (pode ser fora da transação)
    const usuario = await this.prisma.usuario.findUnique({ where: { id: userId } });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    const professor = await this.prisma.professor.findUnique({ where: { id: professorId } });
    const disciplina = await this.prisma.disciplina.findUnique({ where: { id: disciplinaId } });

    try {
      
      // Tudo dentro da transação!
      return await this.prisma.$transaction(async (tx) => {

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

        const dataAvaliacao: Prisma.AvaliacaoCreateInput = {
        usuario: { 
          connect: { id: userId },
        },
        professor: { connect: { id: professorId } },
        disciplina: { connect: { id: disciplinaId } },

        conteudo:conteudo, 
      }

        if (comentarios && comentarios.length > 0) {
          dataAvaliacao.comentarios = {
          //create: comentarios,
          };
        }

        return await tx.avaliacao.create({ data: dataAvaliacao });
      });
    
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        
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
      
      handlePrismaError(error);
    }
  }

  
  async findAll(params: FindAllAvaliacoesDto) {
    const {
      avaliacaoId,
      page,
      pageSize,
      sort,
      order,
      professorID,
      disciplinaID,
      usuarioID,
      search,
      include,
    } = params;

    const pageNumber = page ?? 1;
    const sortBy = sort ?? 'updatedAt';
    const sortOrder = order ?? 'asc';

    let orderBy: any = {};

    if (sortBy === 'professor') {
      orderBy = { professor: { nome: sortOrder } };
    } else if (sortBy === 'disciplina') {
      orderBy = { disciplina: { nome: sortOrder } };
    } else {
      orderBy = { [sortBy]: sortOrder };
    }

    const where: any = {};
    if (professorID) where.professorID = professorID;
    if (usuarioID) where.usuarioID = usuarioID;
    if (disciplinaID) where.disciplinaID = disciplinaID;
    if (search) {
      where.professor = { nome: { contains: search} };
    }
    if (avaliacaoId) where.id = avaliacaoId;
    
    const includeOptions: any = {};

    if (include?.includes('professor')) {
      includeOptions.professor = {
        select: {
          id: true,
          nome: true,
          departamento: true,
          disciplinas: {
            select: {
              disciplina: {
                select: {
                  nome: true
                }
              }
            }
          }
        }
      };
    }
    if (include?.includes('disciplina')) {
      includeOptions.disciplina = {
        select: {
          id: true,
          nome: true,
        },
      };
    }
    if (include?.includes('usuario')) {
      includeOptions.usuario = {
        select: {
          id: true,
          nome: true,
          fotoPerfil: true,
        },
      };
    }
    if (include?.includes('comentarios')) {
      includeOptions.comentarios = {
        select: {
          id: true,
          usuarioID: true, 
          conteudo : true, 
          updatedAt : true, 
          usuario : {
            select : {
              id: true, 
              nome : true, 
              fotoPerfil : true,
            }
          },
        },
      };
    }

    const queryOptions: any = {
      where,
      include: includeOptions,
      orderBy,
    };

    if (pageSize) {
      queryOptions.skip = (pageNumber - 1) * pageSize;
      queryOptions.take = pageSize;
    }

    try{
      
      const [data, total] = await this.prisma.$transaction([
        this.prisma.avaliacao.findMany(queryOptions),
        this.prisma.avaliacao.count({ where }),
      ]);

      const dataWithBase64 = data.map(item => {
        // Trata o usuário da avaliação
        const usuarioAvaliacao = item['usuario']
          ? {
              ...item['usuario'],
              fotoPerfil: BufferImageToBase64String(item['usuario']),
            }
          : null;

        // Trata os comentários (se existirem)
        const comentariosTratados = Array.isArray(item['comentarios'])
          ? item['comentarios'].map(comentario => ({
              ...comentario,
              usuario: comentario.usuario? 
                  {
                    ...comentario.usuario,
                    fotoPerfil: BufferImageToBase64String(comentario.usuario),
                  }
                : null,
            }))
          : [];

        return {
          ...item,
          usuario: usuarioAvaliacao,
          comentarios: comentariosTratados,
        };
      });
  
      return {
        meta: {
          total,
          page: pageNumber,
          pageSize: pageSize ?? total,
          totalPages: Math.ceil(total / (pageSize ?? total)),
        },
        data : dataWithBase64,
      };

    } catch (error) {
      handlePrismaError(error);
    }
  }


  async findOne(id: number) {
    const avaliacao = await this.prisma.avaliacao.findUnique({
      where: {id},
      include: {
        usuario:true,
        professor: true,
        disciplina: true,
        comentarios: true,
      },
    });

    if (!avaliacao) {
      throw new NotFoundException(`Avaliação com ID ${id} não encontrada.`);
    }
    return avaliacao;
  }

  async update(id: number, updateAvaliacaoDto: UpdateAvaliacaoDto) {
    const existingAvaliacao = await this.prisma.avaliacao.findUnique({
      where: { id },
    });
    if (!existingAvaliacao) {
      throw new NotFoundException(`Avaliação com ID ${id} não encontrada.`);
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const dataToUpdate: any = {}; 
        if (updateAvaliacaoDto.conteudo !== undefined) {
          dataToUpdate.conteudo = updateAvaliacaoDto.conteudo;
        }
        //voltar apos criar modal de professor para caso ele não exista, permitir criar um novo professor no update
        if (updateAvaliacaoDto.professorID !== undefined) {
          const professor = await tx.professor.findUnique({ where: { id: updateAvaliacaoDto.professorID } });
          if (!professor) {
            throw new NotFoundException(`ID ${updateAvaliacaoDto.professorID} não encontrado.`);
          }
          dataToUpdate.professorID = updateAvaliacaoDto.professorID;
        }
        
        if (updateAvaliacaoDto.disciplinaID !== undefined) {
          const disciplina = await tx.disciplina.findUnique({ where: { id: updateAvaliacaoDto.disciplinaID } });
          if (!disciplina) {
            throw new NotFoundException(`ID ${updateAvaliacaoDto.disciplinaID}não encontrado.`);
          }
          dataToUpdate.disciplinaID = updateAvaliacaoDto.disciplinaID;
        }

        if (updateAvaliacaoDto.addComentarios && updateAvaliacaoDto.addComentarios.length > 0) {
          const novosComentariosData = updateAvaliacaoDto.addComentarios.map((conteudoComentario: string) => ({
            conteudo: conteudoComentario,
            avaliacaoID: id,
            usuarioID: existingAvaliacao.usuarioID
          }));

          await tx.comentarios.createMany({
            data: novosComentariosData
          });
        }

        const updatedAvaliacao = await tx.avaliacao.update({
          where: { id },
          data: dataToUpdate,
        });

        return {message: `Avaliação ${updatedAvaliacao.id} atualizada com sucesso.`, data: updatedAvaliacao };
      });

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException({
            message: 'Violação de integridade referencial. Verifique se todos os IDs referenciados existem.',
            prismaError: error.meta,
          });
        }
        throw new BadRequestException({
          message: 'Erro Prisma: ' + error.message,
          prismaError: error.meta,
        });
    }
    throw new InternalServerErrorException({
        message: 'Erro interno ao atualizar avaliação.',
        error: error.message,
      });
    }
  }
  
  async remove(id: number) {
    try {
      const avaliacao = await this.prisma.avaliacao.findUnique({ where: { id } });
      if (!avaliacao) {
        throw new NotFoundException(`Avaliação com ID ${id} não encontrada.`);
      }

      const result = await this.prisma.$transaction(async (tx) => {
        // Deleta comentários relacionados primeiro
        await tx.comentarios.deleteMany({
          where: { avaliacaoID: id },
        });

        // Deleta a avaliação
        const removeData = await tx.avaliacao.delete({
          where: { id },
        });

        return removeData;
      }, { timeout: 20000 }); // timeout de 20 segundos

      return {
        message: `Avaliação ${id} removida com sucesso.`,
        data: result,
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
