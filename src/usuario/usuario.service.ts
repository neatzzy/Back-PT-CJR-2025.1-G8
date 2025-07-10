import { ConflictException, Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Public } from 'src/auth/Decorators/isPublic.decorator';
import { BufferImageToBase64String } from 'src/utils/functions';

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUsuarioDto) {
    try {
      // Validação de formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(createUserDto.email)) {
        throw new BadRequestException('Formato de e-mail inválido.');
      }

      
      const existingUser = await this.prisma.usuario.findUnique({ where: { email: createUserDto.email } });
      if (existingUser) {
        throw new ConflictException('Este e-mail já está sendo usado.');
      }
      
      // Validação de senha
      if (!createUserDto.senha || createUserDto.senha.length < 6) {
        throw new BadRequestException('A senha deve ter no mínimo 6 caracteres.');
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
    } catch (error) {
      return {
        status: 'erro',
        message: error.message,
      };
    }
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
    const user =  await this.prisma.usuario.findMany({
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

    return {
      ...user,
      fotoPerfil: BufferImageToBase64String(user),
    };
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

     return {
      ...user,
      fotoPerfil: BufferImageToBase64String(user),
    };
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
      fotoPerfil: BufferImageToBase64String(user),
    };
  }

  async findByEmail(email:string){
    const user = await this.prisma.usuario.findUnique({where : { email }})

    if (!user){
      return null
    }
    
     return {
      ...user,
      fotoPerfil: BufferImageToBase64String(user),
    };
    
  }


  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    try {
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario com ID ${id} não encontrado`);
    }

    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (updateUsuarioDto.email && !emailRegex.test(updateUsuarioDto.email)) {
      throw new BadRequestException('Formato de e-mail inválido.');
    }

    // Verifica se o email já está sendo usado por outro usuário
    if (updateUsuarioDto.email && updateUsuarioDto.email !== user.email) {
      const existingUser = await this.prisma.usuario.findUnique({ where: { email: updateUsuarioDto.email } });
      if (existingUser) {
        throw new ConflictException('Este e-mail já está sendo usado por outro usuário.');
      }
    }

    // Validação de senha obrigatória para atualizar perfil
    if (!updateUsuarioDto.senha) {
      throw new BadRequestException('A senha atual é obrigatória para atualizar o perfil.');
    }
    const senhaValida = await bcrypt.compare(updateUsuarioDto.senha, user.senha);
    if (!senhaValida) {
      throw new UnauthorizedException('Senha atual inválida');
    }

    // Se for trocar a senha, validar novaSenha e confirmarSenha
    let novaSenhaHash: string | undefined = undefined;
    if (updateUsuarioDto.novaSenha) {
      if (updateUsuarioDto.novaSenha.length < 6) {
        throw new BadRequestException('A nova senha deve ter no mínimo 6 caracteres.');
      }
      if (updateUsuarioDto.novaSenha !== updateUsuarioDto.confirmarSenha) {
        throw new BadRequestException('A confirmação da nova senha não coincide.');
      }
      novaSenhaHash = await bcrypt.hash(updateUsuarioDto.novaSenha, 10);
    }

    // Remove campos opcionais se estiverem vazios ou "undefined"
    ['novaSenha', 'confirmarSenha', 'email', 'nome', 'departamento', 'curso'].forEach((field) => {
      if (
        updateUsuarioDto[field] === '' ||
        updateUsuarioDto[field] === undefined ||
        updateUsuarioDto[field] === 'undefined'
      ) {
        delete updateUsuarioDto[field];
      }
    });

    // Atualiza o usuário
    const updatedUser = await this.prisma.usuario.update({
      where: { id },
      data: {
        email: updateUsuarioDto.email ?? user.email,
        senha: novaSenhaHash ?? user.senha,
        nome: updateUsuarioDto.nome ?? user.nome,
        departamento: updateUsuarioDto.departamento ?? user.departamento,
        curso: updateUsuarioDto.curso ?? user.curso,
        fotoPerfil: updateUsuarioDto.fotoPerfil ?? user.fotoPerfil,
      },
    });

    return {
      ...updatedUser,
      fotoPerfil: BufferImageToBase64String(updatedUser),
    };
  } catch (error) {
    throw error;
  }
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


