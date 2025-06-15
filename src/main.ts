import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // Habilita CORS para todas as origens
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
