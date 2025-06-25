import { Module } from '@nestjs/common';
import { ProfessorDisciplinaController } from './professor-disciplina.controller';
import { ProfessorDisciplinaService } from './professor-disciplina.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProfessorDisciplinaController],
  providers: [ProfessorDisciplinaService],
  exports: [ProfessorDisciplinaService],
})
export class ProfessorDisciplinaModule {}