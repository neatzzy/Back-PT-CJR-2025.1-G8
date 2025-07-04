import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, Req, UseGuards } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { Public } from 'src/auth/Decorators/isPublic.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer'
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('professor')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Post()
  @UseInterceptors(FileInterceptor('fotoProfessor'))
async create(@Req() req, @UploadedFile() fotoProfessor?: Multer.File) {
  const createProfessorDto: CreateProfessorDto = {
    nome: req.body.nome,
    departamento: req.body.departamento,
    disciplinaName: req.body.disciplinaName,
    fotoProfessor: fotoProfessor?.buffer,
  };
  return this.professorService.create(createProfessorDto);
}

  @Get() 
  findAll(@Query('search') search?: string) { 
    return this.professorService.findAll(search); 
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.professorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') professorId: string, @Body() updateProfessorDto: UpdateProfessorDto) {
    return this.professorService.update(+professorId, updateProfessorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.professorService.remove(+id);
  }
}
