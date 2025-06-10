import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import Multer from 'multer';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @UseInterceptors(FileInterceptor('fotoPerfil'))
  async create(@Body() createUsuarioDto: CreateUsuarioDto, @UploadedFile() fotoPerfil: Multer.File) {
    return this.usuarioService.create({
      ...createUsuarioDto,
      fotoPerfil: fotoPerfil ? fotoPerfil.buffer : undefined, // <-- só o buffer!
    });
  }

  @Get()
  async findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usuarioService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    try {
      const result = await this.usuarioService.update(+id, updateUsuarioDto);
      return { status: 'successo', message: result.message, data: result.data };
    } catch (error) {
      return { status: 'erro', message: error.message };
  }
}

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.usuarioService.remove(+id);
      return { status: 'successo', message: result.message};
    }catch (error) {
      return { status: 'erro', message: error.message };
  }
}
}