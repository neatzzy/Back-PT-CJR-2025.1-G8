import { Module } from '@nestjs/common';
import { AvaliacaoService } from './avaliacao.service';
import { AvaliacaoController } from './avaliacao.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AvaliacaoController],
  providers: [AvaliacaoService, PrismaService],
  exports: [AvaliacaoService], // Exportando o serviço para ser usado em outros módulos
})
export class AvaliacaoModule {}
