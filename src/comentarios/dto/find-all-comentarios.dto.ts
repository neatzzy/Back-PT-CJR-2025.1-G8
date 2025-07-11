import { IsOptional, IsInt, IsString, IsIn, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllComentariosDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  comentarioID?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  pageSize?: number;

  @IsOptional()
  @IsIn(['createdAt','updatedAt', 'disciplina','professor'])
  sort?: string = 'updatedAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';

  //@IsOptional()
  //@Type(() => Number)
  //@IsInt()
  //professorID?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  usuarioID?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  avaliacaoID?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  include?: string; 

  @IsOptional()
  @IsString()
  token?: string
}