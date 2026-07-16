import { RoleEnum, type Role } from "@/types"

export type ModuleName = "dishes" | "restaurants" | "users"

export enum ModuleNameEnum {
  DISHES = "dishes",
  RESTAURANTS = "restaurants",
  USERS = "users",
}

export type Action = "create" | "read" | "update" | "delete"

export enum ActionEnum {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
}

type ActionsMap = Record<Action, boolean>
type PermissionsMatrix = Record<Role, Record<ModuleName, ActionsMap>>

const getFullAccess = (): ActionsMap => ({
  create: true,
  read: true,
  update: true,
  delete: true,
})
const getOnlyReadAccess = (): ActionsMap => ({
  create: false,
  read: true,
  update: false,
  delete: false,
})
const getNoAccess = (): ActionsMap => ({
  create: false,
  read: false,
  update: false,
  delete: false,
})

export const PERMISSIONS: PermissionsMatrix = {
  [RoleEnum.ADMIN]: {
    dishes: getFullAccess(),
    restaurants: getFullAccess(),
    users: getFullAccess(),
  },
  [RoleEnum.USER]: {
    dishes: getFullAccess(),
    restaurants: getOnlyReadAccess(),
    users: getOnlyReadAccess(),
  },
  [RoleEnum.VISITOR]: {
    dishes: getOnlyReadAccess(),
    restaurants: getOnlyReadAccess(),
    users: getNoAccess(),
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
