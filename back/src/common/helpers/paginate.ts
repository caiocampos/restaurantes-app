import { QueryFilter, Model } from "mongoose"
import { PaginationQueryDto } from "../dto/pagination-query.dto"
import { PaginatedResult } from "../interfaces/paginated-result.interface"

export async function paginateWithQuery<T extends { name: string }>(
  model: Model<T>,
  query: PaginationQueryDto,
  extraFilter: QueryFilter<T> = {}
): Promise<PaginatedResult<T>> {
  const page = query.page ?? 1
  const limit = query.limit ?? 10

  const filter: QueryFilter<T> = { ...extraFilter }
  if (query.name) {
    filter.name = {
      $regex: query.name,
      $options: "i",
    }
  }
  return paginate(model, filter, page, limit)
}

export async function paginate<T>(
  model: Model<T>,
  filter: QueryFilter<T> = {},
  page = 1,
  limit = 10
): Promise<PaginatedResult<T>> {
  const [data, total] = await Promise.all([
    model
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec(),
    model.countDocuments(filter),
  ])

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.max(Math.ceil(total / limit), 1),
  }
}
