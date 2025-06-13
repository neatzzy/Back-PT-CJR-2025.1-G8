import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UsuarioModule,  AuthModule,JwtModule,ConfigModule.forRoot({isGlobal: true,}),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
