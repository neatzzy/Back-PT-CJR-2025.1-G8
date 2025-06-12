import { ConflictException, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handlePrismaError(error: any) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        // Unique constraint failed
        const target = error.meta?.target ? `Campo(s): ${error.meta.target}` : '';
        const cause = error.meta?.cause ? `Valor: ${error.meta.cause}` : '';
        throw new ConflictException(
          `Registro duplicado. ${target} ${cause}`.trim()
        );
      }
      case 'P2003': {
        // Foreign key constraint failed
        const field = error.meta?.field_name ? `Campo: ${error.meta.field_name}` : '';
        throw new BadRequestException(
          `Violação de integridade referencial. ${field}`.trim()
        );
      }
      case 'P2000': {
        // Value too long for column
        const column = error.meta?.column_name ? `Coluna: ${error.meta.column_name}` : '';
        throw new BadRequestException(
          `Valor muito longo para um dos campos. ${column}`.trim()
        );
      }
      case 'P2025': {
        // Record to delete does not exist
        throw new NotFoundException('Registro não encontrado para a operação solicitada.');
      }
      default:
        throw new BadRequestException(
          `Erro de banco de dados: ${error.message} ${error.meta ? JSON.stringify(error.meta) : ''}`
        );
    }
  }

  throw new InternalServerErrorException({
    message: 'Erro interno do servidor.',
    originalError: error.message,
  });
}