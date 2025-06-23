import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';

@Injectable()
export class ProfessorService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProfessorDto: CreateProfessorDto) {
    return 'This action adds a new professor';
  }

  async findAll(searchTerm?: string) {
    const whereCondition = searchTerm?
       {
          nome: {
            contains: searchTerm, 
            mode: 'insensitive', //IMPORTANTE ignora maiusculas e minusculas
          },
        }
      : {}; 

    return this.prisma.professor.findMany({
      where: whereCondition,
      orderBy: {
        nome: 'asc', 
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} professor`;
  }

  update(id: number, updateProfessorDto: UpdateProfessorDto) {
    return `This action updates a #${id} professor`;
  }

  remove(id: number) {
    return `This action removes a #${id} professor`;
  }
}
