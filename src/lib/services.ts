import { api } from "./api"
import type {
  AuthSession,
  Dish,
  DishFilters,
  BaseFilters,
  PaginatedResult,
  Restaurant,
  User,
  AuthTokens,
} from "@/types"

export const authService = {
  login: (username: string, password: string) =>
    api
      .post<AuthSession>("/auth/login", { username, password })
      .then((r) => r.data),

  refresh: (refreshToken: string) =>
    api
      .post<AuthTokens>("/auth/refresh-token", { refreshToken })
      .then((r) => r.data),
}

export const dishService = {
  list: (page: number, limit: number, filters: DishFilters = {}) => {
    const params: Record<string, string | number> = { page, limit }
    if (filters.name) params.name = filters.name
    if (filters.restaurant) params.restaurant = filters.restaurant
    return api
      .get<PaginatedResult<Dish>>("/dishes", { params })
      .then((r) => r.data)
  },
  create: (body: { name: string; price: number; restaurant_id: string }) =>
    api.post<Dish>("/dishes", body).then((r) => r.data),
  update: (
    id: string,
    body: Partial<{ name: string; price: number; restaurant_id: string }>
  ) => api.patch<Dish>(`/dishes/${id}`, body).then((r) => r.data),
  remove: (id: string) => api.delete(`/dishes/${id}`),
}

export const restaurantService = {
  list: (page: number, limit: number, filters: BaseFilters = {}) => {
    const params: Record<string, string | number> = { page, limit }
    if (filters.name) params.name = filters.name
    return api
      .get<PaginatedResult<Restaurant>>("/restaurants", { params })
      .then((r) => r.data)
  },
  create: (body: { name: string; phone: string; address: string }) =>
    api.post<Restaurant>("/restaurants", body).then((r) => r.data),
  update: (
    id: string,
    body: Partial<{ name: string; phone: string; address: string }>
  ) => api.patch<Restaurant>(`/restaurants/${id}`, body).then((r) => r.data),
  remove: (id: string) => api.delete(`/restaurants/${id}`),
}

export const userService = {
  list: (page: number, limit: number, filters: BaseFilters = {}) => {
    const params: Record<string, string | number> = { page, limit }
    if (filters.name) params.name = filters.name
    return api
      .get<PaginatedResult<User>>("/users", { params })
      .then((r) => r.data)
  },
  create: (body: {
    username: string
    password: string
    role: string
    name: string
    lastName: string
  }) => api.post<User>("/users", body).then((r) => r.data),
  update: (
    id: string,
    body: Partial<{
      name: string
      lastName: string
      role: string
      username: string
    }>
  ) => api.patch<User>(`/users/${id}`, body).then((r) => r.data),
  enable: (id: string) =>
    api.patch<User>(`/users/${id}/enable`).then((r) => r.data),
  disable: (id: string) => api.delete<User>(`/users/${id}`).then((r) => r.data),
}
