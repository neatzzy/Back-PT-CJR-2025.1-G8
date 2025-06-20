import { Module } from '@nestjs/common';
import { UsuarioModule } from './usuario/usuario.module';

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AvaliacaoModule } from './avaliacao/avaliacao.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { DisciplinaModule } from './disciplina/disciplina.module';
import { ProfessorModule } from './professor/professor.module';
import { ProfessorDisciplinaModule } from './professor-disciplina/professor-disciplina.module';

@Module({
  imports: [UsuarioModule, 
    AvaliacaoModule, 
    ComentariosModule, 
    DisciplinaModule, 
    ProfessorModule, 
    ProfessorDisciplinaModule, 
    ConfigModule.forRoot({isGlobal: true,}),
    AuthModule,
    JwtModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
