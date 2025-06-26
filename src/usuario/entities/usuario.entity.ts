import { IsEmail, IsInt, IsOptional, IsString } from "class-validator";

export class Usuario {
    @IsInt()
    id: number;

    @IsEmail()
    email: string;

    @IsString()
    senha: string;

    @IsString()
    @IsOptional()    
    name?: string;

    createdAt?: Date; //não é necessário colocar
    updatedAt?: Date; //não é necessário colocar
}





