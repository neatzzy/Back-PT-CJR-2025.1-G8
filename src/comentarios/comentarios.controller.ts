import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';

@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Post()
  async create(@Body() createComentarioDto: CreateComentarioDto) {
    return await this.comentariosService.create(createComentarioDto);
  }

  @Get()
  async findAll() {
    return await this.comentariosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.comentariosService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateComentarioDto: UpdateComentarioDto) {
    return await this.comentariosService.update(+id, updateComentarioDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.comentariosService.remove(+id);
  }
}
