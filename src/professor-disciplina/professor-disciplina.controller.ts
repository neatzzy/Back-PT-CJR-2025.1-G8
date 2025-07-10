import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProfessorDisciplinaService } from './professor-disciplina.service';
import { CreateProfessorDisciplinaDto } from './dto/create-professor-disciplina.dto';
import { UpdateProfessorDisciplinaDto } from './dto/update-professor-disciplina.dto';
import { FindAllProfessorDisciplinaDto } from './dto/find-all-professor-disciplina.dto';
import { Public } from 'src/auth/Decorators/isPublic.decorator';

@Controller('professor-disciplina')
export class ProfessorDisciplinaController {
  constructor(private readonly professorDisciplinaService: ProfessorDisciplinaService) {}

  @Post()
  create(@Body() createProfessorDisciplinaDto: CreateProfessorDisciplinaDto) {
    return this.professorDisciplinaService.create(createProfessorDisciplinaDto);
  }

  @Get()
  @Public()
  findAll(@Query() query: FindAllProfessorDisciplinaDto) {
    return this.professorDisciplinaService.findAll(query);
  }

  @Get(':id/disciplinas')
  async findDisciplinasByProfessor(
    @Param('id') professorId: string,
    @Query('search') search?: string,
    
  ){
    return this.professorDisciplinaService.findDisciplinasByProfessor(+professorId, search);
  }


  @Patch(':id')
  async(@Param('id') id: string, @Body() updateProfessorDisciplinaDto: UpdateProfessorDisciplinaDto) {
    return this.professorDisciplinaService.update(+id, updateProfessorDisciplinaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.professorDisciplinaService.remove(+id);
  }
}
