import { Role } from "../enums/role.enum";

export type ModuleName = "dishes" | "restaurants" | "users";
export type Action = "create" | "read" | "update" | "delete";

type ActionsMap = Record<Action, boolean>;
type PermissionsMatrix = Record<Role, Record<ModuleName, ActionsMap>>;

/**
 * Fonte única de verdade sobre o que cada role pode fazer em cada módulo.
 * - "admin" tem acesso total a tudo.
 * - "user" tem acesso total a "dishes", somente leitura em "restaurants" e "users".
 *
 * Para adicionar um novo módulo, basta incluir uma nova chave em ModuleName
 * e definir as permissões de cada role aqui.
 */
export const PERMISSIONS: PermissionsMatrix = {
  [Role.ADMIN]: {
    dishes: { create: true, read: true, update: true, delete: true },
    restaurants: { create: true, read: true, update: true, delete: true },
    users: { create: true, read: true, update: true, delete: true },
  },
  [Role.USER]: {
    dishes: { create: true, read: true, update: true, delete: true },
    restaurants: { create: false, read: true, update: false, delete: false },
    users: { create: false, read: true, update: false, delete: false },
  },
};

export function hasPermission(
  role: Role,
  module: ModuleName,
  action: Action,
): boolean {
  return PERMISSIONS[role]?.[module]?.[action] ?? false;
}
