import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // Habilita CORS para todas as origens
  app.enableCors();
  await app.listen(process.env.PORT_SERVER || 3000);
}
bootstrap();
