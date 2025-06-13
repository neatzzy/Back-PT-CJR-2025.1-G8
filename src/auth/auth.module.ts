import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsuarioService } from 'src/usuario/usuario.service';

@Module({
  imports: [UsuarioModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService,UsuarioService],
})
export class AuthModule {}
