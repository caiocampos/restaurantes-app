import { SetMetadata } from "@nestjs/common";
import { Action, ModuleName } from "./permissions.matrix";

export const PERMISSION_KEY = "required_permission";

export interface RequiredPermission {
  module: ModuleName;
  action: Action;
}

/**
 * Decorator usado nos controllers para declarar qual permissão
 * (módulo + ação) é necessária para acessar aquela rota.
 * Ex.: @RequirePermission('dishes', 'create')
 */
export const RequirePermission = (module: ModuleName, action: Action) =>
  SetMetadata(PERMISSION_KEY, { module, action } as RequiredPermission);
