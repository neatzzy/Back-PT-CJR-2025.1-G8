import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import  Multer from 'multer';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Public } from 'src/auth/Decorators/isPublic.decorator';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('fotoPerfil'))
  async create(@Body() createUsuarioDto: CreateUsuarioDto, @UploadedFile() fotoPerfil: Multer.File) {
    return this.usuarioService.create({
      ...createUsuarioDto,
      fotoPerfil: fotoPerfil ? fotoPerfil.buffer : undefined, // <-- só o buffer!
    });
  }

  @Public()
  @Get()
  async findAll() {
    return this.usuarioService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usuarioService.findOne(+id);
  }

  @Public()
  @Patch(':id')
  @UseInterceptors(FileInterceptor('fotoPerfil'))
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @UploadedFile() fotoPerfil?: Multer.File
  ) {
    // Adiciona o buffer da foto ao DTO, se enviado
    if (fotoPerfil) {
      updateUsuarioDto.fotoPerfil = fotoPerfil.buffer;
    }
    try {
      const result = await this.usuarioService.update(+id, updateUsuarioDto);
      return { status: 'successo', data: result };
    } catch (error) {
      return { status: 'erro', message: error.message };
    }
  }

  @Public()
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