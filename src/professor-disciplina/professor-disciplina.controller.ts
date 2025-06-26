import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProfessorDisciplinaService } from './professor-disciplina.service';
import { CreateProfessorDisciplinaDto } from './dto/create-professor-disciplina.dto';
import { UpdateProfessorDisciplinaDto } from './dto/update-professor-disciplina.dto';

@Controller('professor-disciplina')
export class ProfessorDisciplinaController {
  constructor(private readonly professorDisciplinaService: ProfessorDisciplinaService) {}

  @Post()
  create(@Body() createProfessorDisciplinaDto: CreateProfessorDisciplinaDto) {
    return this.professorDisciplinaService.create(createProfessorDisciplinaDto);
  }

  @Get()
  findAll() {
    return this.professorDisciplinaService.findAll();
  }

  @Get(':id/disciplinas')
  async findDisciplinasByProfessor(
    @Param('id') professorId: string,
    @Query('search') search?: string
  ){
    return this.professorDisciplinaService.findDisciplinasByProfessor(+professorId, search);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfessorDisciplinaDto: UpdateProfessorDisciplinaDto) {
    return this.professorDisciplinaService.update(+id, updateProfessorDisciplinaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.professorDisciplinaService.remove(+id);
  }
}
