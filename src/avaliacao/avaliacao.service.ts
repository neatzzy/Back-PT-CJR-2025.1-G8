import { ConflictException, Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
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
