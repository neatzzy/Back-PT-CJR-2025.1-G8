import { AvaliacaoEntity } from './../entities/avaliacao.entity';
import { CreateComentarioDto } from 'src/comentarios/dto/create-comentario.dto';
import { IsInt, IsString, IsNotEmpty, ValidateNested, IsArray, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateAvaliacaoDto extends PartialType(AvaliacaoEntity) {
  @IsInt({ message: 'O campo usuarioID deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'O campo usuarioID não pode estar vazio.' })
  usuarioID: number;

  @IsString({ message: 'O nome do professor deve ser um texto' })
  @IsOptional({ message: 'O campo nome do professor é opcional.' })
  professorNome: string;

  @IsString({ message: 'O nome da disciplina deve ser um texto' })
  @IsOptional({ message: 'O campo nome da disciplina é opcional.' })
  disciplinaNome: string;

  @IsString({ message: 'O campo conteúdo deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo conteúdo não pode estar vazio.' })
  conteudo: string;

  @ValidateNested({ each: true })
  @Type(() => CreateComentarioDto)
  @IsArray()
  @IsOptional()
  comentarios?: CreateComentarioDto[];
}
