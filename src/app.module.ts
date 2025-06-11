import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { AvaliacaoModule } from './avaliacao/avaliacao.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { DisciplinaModule } from './disciplina/disciplina.module';
import { ProfessorModule } from './professor/professor.module';
import { ProfessorDisciplinaModule } from './professor-disciplina/professor-disciplina.module';

@Module({
  imports: [UsuarioModule, AvaliacaoModule, ComentariosModule, DisciplinaModule, ProfessorModule, ProfessorDisciplinaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
