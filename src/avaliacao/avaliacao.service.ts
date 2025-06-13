import { ConflictException, Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { FindAllAvaliacoesDto } from './dto/find-all-avaliacoes.dto';
import { handlePrismaError } from 'src/config/ErrorPrisma';

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
      page,
      pageSize,
      sort,
      order,
      professorID,
      disciplinaID,
      search,
      include,
    } = params;

    const pageNumber = page ?? 1;
    const sortBy = sort ?? 'createdAt';
    const sortOrder = order ?? 'desc';

    const where: any = {};
    if (professorID) where.professorID = professorID;
    if (disciplinaID) where.disciplinaID = disciplinaID;
    if (search) {
      where.professor = { nome: { contains: search} };
    }
    const includeOptions: any = {};
    
    if (include?.includes('professor')) includeOptions.professor = true; 
    if (include?.includes('disciplina')) includeOptions.disciplina = true; 
    if (include?.includes('comentarios')) includeOptions.comentarios = true;

    const queryOptions: any = {
      where,
      include: includeOptions,
      orderBy: { [sortBy]: sortOrder },
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
  
      return {
        meta: {
          total,
          page: pageNumber,
          pageSize: pageSize ?? total,
          totalPages: Math.ceil(total / (pageSize ?? total)),
        },
        data
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

          await tx.comentario.createMany({
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
    const avaliacao = await this.prisma.avaliacao.findUnique({ where: { id } });
    if (!avaliacao) {
      throw new NotFoundException(`Avaliação com ID ${id} não encontrada.`);
    }
    await this.prisma.avaliacao.delete({ where: { id } });
    return { message: `Avaliação ${id} removida com sucesso.` };
  }
}
