import { SetMetadata } from "@nestjs/common"
import { Action, ModuleName } from "./permissions.matrix"

export const PERMISSION_KEY = "required_permission"

export interface RequiredPermission {
  module: ModuleName
  action: Action
}

export const RequirePermission = (module: ModuleName, action: Action) =>
  SetMetadata(PERMISSION_KEY, { module, action } as RequiredPermission)
