import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

/**
 * DTO reutilizado por todos os módulos para:
 * - listagem paginada (page/limit)
 * - filtro por nome (name) usando regex case-insensitive
 */
export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  name?: string;
}
