// src/avaliacoes/dto/find-all-avaliacoes.dto.ts
import { IsOptional, IsInt, IsString, IsIn, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllAvaliacoesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  pageSize?: number = 5;

  @IsOptional()
  @IsIn(['createdAt','updateAt', 'disciplina','professor'])
  sort?: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  professorID?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  disciplinaID?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  include?: string; 
}
