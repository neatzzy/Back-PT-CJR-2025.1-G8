import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter} from './config/HttpExceptionFilter'
import { json } from 'express';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => new BadRequestException(errors),
  }));
  
  app.useGlobalFilters(new HttpExceptionFilter());

  // Habilita CORS para todas as origens
  app.enableCors();
  app.use(json({ limit: '50mb' }));
  await app.listen(process.env.PORT_SERVER || 5000);

  
}

bootstrap();
