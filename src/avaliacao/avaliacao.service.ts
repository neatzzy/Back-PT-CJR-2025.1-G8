import { Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import e from "express";
import { CreateAvaliacaoDto } from "./dto/create-avaliacao.dto";

@Injectable()
export class AvaliacaoService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createAvaliacaoDto: CreateAvaliacaoDto) {
        const data = {
            professorId: createAvaliacaoDto.professorId,
            conteudo: createAvaliacaoDto.conteudo,
            usuarioId: createAvaliacaoDto.usuarioId, 

        }
}