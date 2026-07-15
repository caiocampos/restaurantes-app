export type Role = "admin" | "user"

export interface User {
  id: string
  username: string
  role: Role
  name: string
  lastName: string
  enabled: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Restaurant {
  id: string
  name: string
  phone: string
  address: string
  createdAt?: string
  updatedAt?: string
}

export interface Dish {
  id: string
  name: string
  price: number
  restaurant_id: string
  restaurantName?: string
  createdAt?: string
  updatedAt?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthUser extends Pick<
  User,
  "username" | "role" | "name" | "lastName"
> {}

export interface AuthSession extends AuthTokens {
  user: AuthUser
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface DishFilters {
  name?: string
  restaurant?: string
}

export interface BaseFilters {
  name?: string
}
