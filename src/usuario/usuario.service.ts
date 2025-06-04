import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUsuarioDto) {
    const existingUser = await this.prisma.usuario.findUnique({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new ConflictException('Este e-mail já está sendo usado.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.senha, 10);

    const data = {
      email: createUserDto.email,
      senha: hashedPassword,
      nome: createUserDto.nome ?? '',
      departamento: createUserDto.departamento ?? '',
      curso: createUserDto.curso ?? '',
      fotoPerfil: createUserDto.fotoPerfil,
    };
    
    return await this.prisma.usuario.create({ data });
  }

  async findAll() {
    return await this.prisma.usuario.findMany({
      select: {
        id: true,
        email: true,
        nome: true,
        curso: true, 
        departamento: true,
        fotoPerfil: true,
        avaliacoes: true, 
        comentarios: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nome: true,
        curso: true, 
        departamento: true,
        fotoPerfil: true,
        avaliacoes: true, 
        comentarios: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
