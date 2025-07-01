import { Injectable } from '@nestjs/common';
import { CreateProfessorDisciplinaDto } from './dto/create-professor-disciplina.dto';
import { UpdateProfessorDisciplinaDto } from './dto/update-professor-disciplina.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindAllProfessorDisciplinaDto } from './dto/find-all-professor-disciplina.dto';
import { handlePrismaError } from 'src/config/ErrorPrisma';
import { BufferImageToBase64String } from 'src/utils/functions';
@Injectable()
export class ProfessorDisciplinaService {
  constructor(private prisma: PrismaService) {}
  create(createProfessorDisciplinaDto: CreateProfessorDisciplinaDto) {
    return 'This action adds a new professorDisciplina';
  }

  async findDisciplinasByProfessor(professorId: number, searchTerm?: string) {
    const professorDisciplinas = await this.prisma.professorDisciplina.findMany({
      where: {
        professorID: professorId,
        disciplina: searchTerm
          ? {
              is: {
                nome: {
                  contains: searchTerm,
                },
              },
            }
          : undefined,
      },
      select: {
        disciplina: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      orderBy: {
        disciplina: { nome: 'asc' },
      },
    });

    return professorDisciplinas.map(pd => pd.disciplina);
  }

  async findAll(params : FindAllProfessorDisciplinaDto) {
    const {
      page,
      pageSize,
      professorID,
      disciplinaID,
      search,
      order,
      sort,
      include,
    } = params;

    const pageNumber = page ?? 1;
    const sortBy = sort ?? 'professor';
    const sortOrder = order ?? 'asc';

    let orderBy: any = {};
    
    if (sortBy === 'professor' || sortBy === 'disciplina') {
      orderBy = { [sortBy]: { nome: sortOrder } };
    } else{
      orderBy = { 'professor' : {[sortBy] : sortOrder} };
    }

    const where: any = {};
    if (professorID) where.professorID = professorID;
    if (disciplinaID) where.disciplinaID = disciplinaID;
    if (search) {
      where.professor = { 
        nome: { 
          contains: search
        } 
      };
    }
    
    const includeOptions: any = {};

    if (include?.includes('professor')) {
      includeOptions.professor = {
        select: {
          id: true,
          nome: true,
          departamento : true,
          updatedAt : true, 
          createdAt : true,
          fotoPerfil : true,
        }
      };
    }
    if (include?.includes('disciplina')) {
      includeOptions.disciplina = {
        select: {
          id: true,
          nome: true,
          updatedAt : true, 
          createdAt : true,
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
        this.prisma.professorDisciplina.findMany(queryOptions),
        this.prisma.professorDisciplina.count({ where }),
      ]);


      const dataWithBase64 = data.map(item => {
         if (item['professor'] && item['professor']?.fotoPerfil) {
          let fotoPerfil = item['professor']?.fotoPerfil ? 
            BufferImageToBase64String(item['professor']) : null;

          return {
            ...item,
            professor: {
              ...item['professor'],
              fotoPerfil,
            },
          };
        }
        return item;

      });
  
      return {
        meta: {
          total,
          page: pageNumber,
          pageSize: pageSize ?? total,
          totalPages: Math.ceil(total / (pageSize ?? total)),
        },
        data: dataWithBase64,
      };

    } catch (error) {
      handlePrismaError(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} professorDisciplina`;
  }

  update(id: number, updateProfessorDisciplinaDto: UpdateProfessorDisciplinaDto) {
    return `This action updates a #${id} professorDisciplina`;
  }

  remove(id: number) {
    return `This action removes a #${id} professorDisciplina`;
  }
}
