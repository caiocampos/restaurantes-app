import { Role } from "../enums/role.enum"
import { acceptVisitors } from "./permissions-env"

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
  [Role.ADMIN]: {
    dishes: getFullAccess(),
    restaurants: getFullAccess(),
    users: getFullAccess(),
  },
  [Role.USER]: {
    dishes: getFullAccess(),
    restaurants: getOnlyReadAccess(),
    users: getOnlyReadAccess(),
  },
  [Role.VISITOR]: {
    dishes: getOnlyReadAccess(),
    restaurants: getOnlyReadAccess(),
    users: getNoAccess(),
  },
}

export function hasPermission(
  role: Role,
  module: ModuleName,
  action: Action
): boolean {
  if (role === Role.VISITOR && !acceptVisitors()) {
    return false
  }
  return PERMISSIONS[role]?.[module]?.[action] ?? false
}
