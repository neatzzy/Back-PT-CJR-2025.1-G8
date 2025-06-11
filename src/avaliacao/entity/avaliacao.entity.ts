import { IsInt, IsOptional, IsString } from "class-validator";

export class Avaliacao {
    @IsInt()
    id:number;
    usuarioId:number;

    @IsString()
    conteudo:string;
   
    professorID:string;

    disciplinaID:string;

    @IsString()
    @IsOptional()

    createdAt?: Date; //não é necessário colocar
    updatedAt?: Date; //não é necessário colocar
}





