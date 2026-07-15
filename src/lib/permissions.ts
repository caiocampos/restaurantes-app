import type { Role } from "@/types"

export type ModuleName = "dishes" | "restaurants" | "users"
export type Action = "create" | "read" | "update" | "delete"

type ActionsMap = Record<Action, boolean>
type PermissionsMatrix = Record<Role, Record<ModuleName, ActionsMap>>

export const PERMISSIONS: PermissionsMatrix = {
  admin: {
    dishes: { create: true, read: true, update: true, delete: true },
    restaurants: { create: true, read: true, update: true, delete: true },
    users: { create: true, read: true, update: true, delete: true },
  },
  user: {
    dishes: { create: true, read: true, update: true, delete: true },
    restaurants: { create: false, read: true, update: false, delete: false },
    users: { create: false, read: true, update: false, delete: false },
  },
}

export function hasPermission(
  role: Role | undefined,
  module: ModuleName,
  action: Action
): boolean {
  if (!role) return false
  return PERMISSIONS[role]?.[module]?.[action] ?? false
}
