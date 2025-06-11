import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.professorDisciplinaService.findOne(+id);
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
