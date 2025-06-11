import { AvaliacaoEntity } from './../entities/avaliacao.entity';
import { IsInt, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types'; 

export class CreateAvaliacaoDto extends PartialType(AvaliacaoEntity) {
  @IsInt({ message: 'O campo usuarioID deve ser preenchido' })
  @IsNotEmpty({ message: 'O campo usuarioID não pode estar vazio.' })
  usuarioID: number;

  @IsOptional() // opcional enquanto não implementado o crud de professor
  @IsInt({ message: 'O campo professorID deve ser um número inteiro.' })
  professorID?: number;

  @IsOptional() // opcional enquanto não implementado o crud de disciplina
  @IsInt({ message: 'O campo disciplinaID deve ser um número inteiro.' })
  disciplinaID?: number;

  @IsString({ message: 'O campo conteúdo deve ter uma mensagem' })
  @IsNotEmpty({ message: 'O campo conteúdo não pode estar vazio.' })
  conteudo: string;

  @IsOptional() // opcional enquanto não implementado o crud de comentários
  @IsString({ message: 'O campo comentários deve ser uma string.' })
  comentarios?: string;
}
