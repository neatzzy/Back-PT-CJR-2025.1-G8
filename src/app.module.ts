import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { ProfessorModule } from './professor/professor.module';

@Module({
  imports: [UsuarioModule, ProfessorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
