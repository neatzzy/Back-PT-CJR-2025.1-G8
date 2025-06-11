import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class Avaliacao {
    @IsInt()
    id:number;
    usuarioId:number;

    @IsInt()
    @IsOptional()
    professorID:number;
    
    @IsInt()
    @IsOptional()
    disciplinaID:number;
    
    @IsString()
    @IsNotEmpty({ message: 'O campo conteúdo não pode estar vazio.' })
    conteudo:string;

    @IsOptional()
    @IsString()
    comentarios?: string; // opcional enquanto não implementado o crud de comentários

    createdAt?: Date; //não é necessário colocar
    updatedAt?: Date; //não é necessário colocar
}





