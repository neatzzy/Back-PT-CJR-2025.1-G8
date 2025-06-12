import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AvaliacaoService } from './avaliacao.service';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';
import { FindAllAvaliacoesDto } from './dto/find-all-avaliacoes.dto';

@Controller('avaliacao')
export class AvaliacaoController {
  constructor(private readonly avaliacaoService: AvaliacaoService) {}

  @Post()
  create(@Body() createAvaliacaoDto: CreateAvaliacaoDto) {
    return this.avaliacaoService.create(createAvaliacaoDto);
  }

 @Get()
  findAll(@Query() query: FindAllAvaliacoesDto) {
    return this.avaliacaoService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.avaliacaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAvaliacaoDto: UpdateAvaliacaoDto) {
    return this.avaliacaoService.update(+id, updateAvaliacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.avaliacaoService.remove(+id);
  }
}
