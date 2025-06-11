import { IsInt, IsOptional, IsString } from "class-validator";

export class Avaliacao {
    @IsInt()
    id:number;
    usuarioId:number;

    @IsString()
    conteudo:string;

    @IsInt()
    @IsOptional()    
    professorID?:string;
    
    disciplinaID?:string;

    createdAt?: Date; //não é necessário colocar
    updatedAt?: Date; //não é necessário colocar
}





