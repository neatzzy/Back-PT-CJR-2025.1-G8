import { PartialType } from '@nestjs/mapped-types';
import { CreateComentarioDto } from './create-comentario.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateComentarioDto extends PartialType(CreateComentarioDto) {
    @IsOptional()
    @IsInt({message: 'O comentário deve ser uma string'})
    avaliacaoId?: number;

    @IsOptional()
    @IsString({message: 'O conteúdo deve ser uma String'})
    conteudo?: string ;




}
