import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Public } from 'src/auth/Decorators/isPublic.decorator';

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

  async login(email: string, senha: string) {
    const user = await this.prisma.usuario.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }
    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }
    // Retorne apenas dados públicos do usuário
    const { senha: _, ...userData } = user;
    return userData;
  }

  @Public()
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

  @Public()
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
      throw new NotFoundException(`Usuario com ID ${id} não encontrado`);
    }

    return user;
  }

  @Public()
  async findMe(id: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nome: true,
        curso: true, 
        departamento: true,
        fotoPerfil: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario com ID ${id} não encontrado`);
    }

    return {
      ...user,
      fotoPerfil: user.fotoPerfil ? Buffer.from(user.fotoPerfil).toString('base64') : null,
    };
  }

  async findByEmail(email:string){
    const user = await this.prisma.usuario.findUnique({where : { email }})

    if (!user){
      return null
    }
    
    return user
    
  }


  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario com ID ${id} não encontrado`);
    }
    updateUsuarioDto.senha = await bcrypt.hash(updateUsuarioDto.senha, 10);

    const updateUsuario = await this.prisma.usuario.update({
      where: { id },
      data: updateUsuarioDto,
    });
    return {message: 'Usuário atualizado com sucesso', data: updateUsuario};    
  }

  async remove(id: number) {
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario com ID ${id} não encontrado`);
    }
    await this.prisma.usuario.delete({ where: { id } });
    return { message: `Usuário removido com sucesso` };
  }
}
