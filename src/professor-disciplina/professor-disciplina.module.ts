import { Module } from '@nestjs/common';
import { ProfessorDisciplinaService } from './professor-disciplina.service';
import { ProfessorDisciplinaController } from './professor-disciplina.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ProfessorDisciplinaController],
  providers: [ProfessorDisciplinaService, PrismaService],
  exports: [ProfessorDisciplinaService],
})
export class ProfessorDisciplinaModule {}
