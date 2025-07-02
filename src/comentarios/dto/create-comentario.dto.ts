import { ComentarioEntity } from "../entities/comentario.entity";
import { PartialType } from "@nestjs/mapped-types";
import { IsInt, IsString, IsNotEmpty, ValidateNested, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';


export class CreateComentarioDto extends PartialType(ComentarioEntity){
    @IsInt({ message: 'O campo userId deve ser um número inteiro.' })
    @IsNotEmpty({ message: 'O campo userId não pode estar vazio.' })
    userId: number;

    @IsInt({ message: 'avaliacaoId deve ser um número inteiro.' })
    @IsNotEmpty({ message: 'O campo disciplinaId não pode estar vazio.' })
    avaliacaoId: number;


    @IsString({ message: 'O conteudo deve ser String' })
    @IsNotEmpty({ message: 'O campo conteudo não pode estar vazio.' })
    conteudo: string;
}
