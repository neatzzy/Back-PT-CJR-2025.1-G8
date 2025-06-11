import { ComentarioEntity } from "../entities/comentario.entity";
import { PartialType } from "@nestjs/mapped-types";

export class CreateComentarioDto extends PartialType(ComentarioEntity){}
