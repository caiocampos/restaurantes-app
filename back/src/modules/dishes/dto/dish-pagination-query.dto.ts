import { Type } from "class-transformer"
import { IsInt, IsOptional, IsString, Min } from "class-validator"
import { PaginationQueryDto } from "../../../common/dto/pagination-query.dto"

export class DishPaginationQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  restaurant?: string
}
