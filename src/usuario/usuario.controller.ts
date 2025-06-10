import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginUsuarioDto) {
    return this.usuarioService.login(loginDto.email, loginDto.senha);
  }

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
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