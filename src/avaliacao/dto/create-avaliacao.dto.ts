import { IsEmail, IsOptional, IsString, MinLength, IsNotEmpty, IsInt } from 'class-validator';
import { Avaliacao } from '../entity/avaliacao.entity';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAvaliacaoDto extends PartialType(Avaliacao){
    @IsInt({ message: 'O campo Professor Id deve ser preenchido' })
    @IsNotEmpty({ message: 'O campo Professor Id não pode estar vazio.' })
    professorId: number;

    @IsString({ message: 'O campo conteúdo deve ter uma mensagem' })
    @IsNotEmpty({ message: 'O campo conteúdo não pode estar vazio.' })
    conteudo: string;

    /*pedir curso e/ou departamento do professor para friltrar as avaliações?*/
    
}
