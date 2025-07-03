import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { handlePrismaError } from 'src/config/ErrorPrisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
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
      
        // Verifica se a avaliação existe
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

      return this.prisma.comentarios.create({ data: dataComentario });
    

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

  async findAll() {
    return `Essa ação retorna todos os comentarios`;
  }

  findOne(id: number) {
    return `Essa ação retorna o  #${id} comentario`;
  }

  update(id: number, updateComentarioDto: UpdateComentarioDto) {
    return `Essa ação atualiza o #${id} comentario`;
  }

  remove(id: number) {
    return `Essa ação remove o  #${id} comentario`;
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

