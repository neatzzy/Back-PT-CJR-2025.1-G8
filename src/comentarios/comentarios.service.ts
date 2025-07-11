import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { handlePrismaError } from 'src/config/ErrorPrisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { FindAllComentariosDto } from './dto/find-all-comentarios.dto';
import { BufferImageToBase64String } from 'src/utils/functions';
//import { FindAllAvaliacoesDto } from './dto/find-all-avaliacoes.dto';

@Injectable()
export class ComentariosService {
  constructor(private readonly prisma: PrismaService) {}
  
  async create(createComentarioDto: CreateComentarioDto) {
    const { userId, avaliacaoId, conteudo } = createComentarioDto;

    const usuario = await this.prisma.usuario.findUnique({ where: { id: userId } });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    try{
      
        const relacao = await this.prisma.avaliacao.findUnique({
          where: { id: avaliacaoId },
        });
        if (!relacao) {
          throw new NotFoundException('Avaliação não encontrada.');
        }

        const dataComentario: Prisma.ComentariosCreateInput = {
          conteudo,
          usuario: { connect: { id: userId } },
          avaliacao: { connect: { id: avaliacaoId } },
        };

        return await this.prisma.comentarios.create({ data: dataComentario });

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
      
      //return 'Essa ação cria um novo comentario';
    }

  async findAll(params:FindAllComentariosDto) {
    const {
      comentarioID,
      page = 1 ,
      pageSize,
      sort,
      order,
      usuarioID,
      avaliacaoID,
      search,
      include,
    } = params;

    const pageNumber = page ?? 1;
    const sortBy = sort ?? 'updatedAt';
    const sortOrder = order ?? 'asc';
    const skip = (page - 1) * (pageSize ?? 0);

    let orderBy: any = {};

    if (sortBy === 'professor') {
      orderBy = { professor: { nome: sortOrder } };
    } else if (sortBy === 'disciplina') {
      orderBy = { disciplina: { nome: sortOrder } };
    } else {
      orderBy = { [sortBy]: sortOrder };
    }

    const where: any = {};
    if (avaliacaoID) where.professorID = avaliacaoID;
    if (usuarioID) where.usuarioID = usuarioID;
    if (avaliacaoID) where.disciplinaID = avaliacaoID;
    if (search) {
      where.professor = { nome: { contains: search} };
    }
    if (comentarioID) where.id = comentarioID;
    
    const includeOptions: any = {};
    
    // se quiser colocar lógica de include aqui

    try{

        const [comentarios, total] = await Promise.all([
      this.prisma.comentarios.findMany({
        where,
        //orderBy: { [sort]: sortOrder },
        skip: pageSize ? skip : undefined,
        take: pageSize,
        include: includeOptions,
      }),
      this.prisma.comentarios.count({ where }),
    ]);

    //se quiser colocar imagem no comentário

    //const dataWithBase64 = comentarios.map(item => {
     // let usuarioComentario = item.usuario;
    //  if (usuarioComentario?.fotoPerfil) {
    //      usuarioComentario = {
    //      ...usuarioComentario,
    //      fotoPerfil: BufferImageToBase64String(usuarioComentario.fotoPerfil),
    //    };
    //  }

    //  return {
    //    ...item,
    //    usuario: usuarioComentario,
    //    };
    //  });
      return {
        meta: {
          page: pageNumber,
          pageSize: pageSize ?? total,
          totalPages: Math.ceil(total / (pageSize ?? total)),
        },
        //data : dataWithBase64,
      };
    }catch (error) {
    handlePrismaError(error);
    }


  }

  findOne(id: number) {
    return `Essa ação retorna o  #${id} comentario`;
  }

  update(id: number, updateComentarioDto: UpdateComentarioDto) {
    return `Essa ação atualiza o #${id} comentario`;
  }

  async remove(id: number) {
    try {
          const comentarios = await this.prisma.comentarios.findUnique({ where: { id } });
          if (!comentarios) {
            throw new NotFoundException(`Comentário com ID ${id} não encontrada.`);
          }
          await this.prisma.comentarios.delete({
            where: { id },
          });
          
    
          return {
            message: `Avaliação ${id} removida com sucesso.`,
          };
        } catch (error) {
          handlePrismaError(error);
        }
  }
}
  function findAll() {
    throw new Error('Function not implemented.');
  }

  function findOne(id: any, number: any) {
    throw new Error('Function not implemented.');
  }

  function remove(id: any, number: any) {
    throw new Error('Function not implemented.');
  }

