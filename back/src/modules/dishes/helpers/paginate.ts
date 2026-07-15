import { QueryFilter, Model } from "mongoose"
import { DishPaginationQueryDto } from "../dto/dish-pagination-query.dto"
import { PaginatedResult } from "../../../common/interfaces/paginated-result.interface"
import { paginate } from "../../../common/helpers/paginate"
import { DishDocument } from "../schemas/dish.schema"

export async function paginateDishes(
  model: Model<DishDocument>,
  query: DishPaginationQueryDto,
  extraFilter: QueryFilter<DishDocument> = {}
): Promise<PaginatedResult<DishDocument>> {
  const page = query.page ?? 1
  const limit = query.limit ?? 10

  const filter: QueryFilter<DishDocument> = { ...extraFilter }
  if (query.name) {
    filter.name = {
      $regex: query.name,
      $options: "i",
    }
  }
  if (query.restaurant) {
    filter.restaurant_id = query.restaurant
  }
  return paginate(model, filter, page, limit)
}
