import { Injectable } from '@nestjs/common';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';

@Injectable()
export class ComentariosService {
  create(createComentarioDto: CreateComentarioDto) {
    return 'Essa ação cria um novo comentario';
  }

  findAll() {
    return `Essa ação retorna todos os comentarios`;
  }

  findOne(id: number) {
    return `Essa ação retorna o  #${id} comentario`;
  }

  update(id: number, updateComentarioDto: UpdateComentarioDto) {
    return `Essa ação atualiza o #${id} comentario`;
  }

  remove(id: number) {
    return `Essa ação remove o  #${id} comentario`;
  }
}
