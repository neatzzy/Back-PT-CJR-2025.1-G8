import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsString, IsInt } from 'class-validator';
import { AvaliacaoEntity } from '../entities/avaliacao.entity';
import { IsNotEmpty, IsOptional } from 'class-validator';

/*marcio - não coloquei um update para os comentarios da avaliação, por serem simples, achei que comentarios podem ser apenas 
adicionados ou removidos, como no instagram, por exemplo. */
export class UpdateAvaliacaoDto extends PartialType(AvaliacaoEntity) {
    @IsOptional()
    @IsInt({ message: 'o ID do professor deve ser um número inteiro.' })
    professorID?: number;

    @IsOptional()
    @IsInt({message: 'o ID da disciplina deve ser um número inteiro.' })
    disciplinaID?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'O campo conteúdo não pode estar vazio.' })
    conteudo?: string;

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    @IsNotEmpty({each: true })
    addComentarios?: string[]; //permite adicionar novos comentários, a partir de uma atualização na avaliação
}
