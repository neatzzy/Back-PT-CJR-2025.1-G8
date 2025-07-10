import { AvaliacaoEntity } from './../entities/avaliacao.entity';
import { CreateComentarioDto } from 'src/comentarios/dto/create-comentario.dto';
import { IsInt, IsString, IsNotEmpty, ValidateNested, IsArray, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateAvaliacaoDto extends PartialType(AvaliacaoEntity) {
  @IsInt({ message: 'O campo userId deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'O campo userId não pode estar vazio.' })
  userId: number;

  @IsInt({ message: 'O campo professorID deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'O campo professorID não pode estar vazio.' })
  professorId: number;

  @IsInt({ message: 'disciplinaId deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'O campo disciplinaId não pode estar vazio.' })
  disciplinaId: number;

  @IsString({ message: 'O professor deve ter um nome' })
  @IsOptional({ message: 'O campo nome do professor é opcional.' })
  professorNome: string;

  @IsString({ message: 'O nome da disciplina deve ser um texto' })
  @IsOptional({ message: 'O campo nome da disciplina é opcional.' })
  disciplinaNome: string;

  @IsString()
  @IsNotEmpty({ message: 'O campo conteúdo não pode estar vazio.' })
  conteudo: string;

  @ValidateNested({ each: true })
  @Type(() => CreateComentarioDto)
  @IsArray()
  @IsOptional()
  comentarios?: CreateComentarioDto[];
}
