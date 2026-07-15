import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import {
  PERMISSION_KEY,
  RequiredPermission,
} from "../permissions/require-permission.decorator"
import { hasPermission } from "../permissions/permissions.matrix"
import { RequestUser } from "../auth/jwt.strategy"

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<
      RequiredPermission | undefined
    >(PERMISSION_KEY, [context.getHandler(), context.getClass()])

    if (!required) return true

    const request = context.switchToHttp().getRequest()
    const user = request.user as RequestUser | undefined

    if (!user) {
      throw new ForbiddenException("Usuário não autenticado")
    }

    const allowed = hasPermission(user.role, required.module, required.action)
    if (!allowed) {
      throw new ForbiddenException(
        `A role "${user.role}" não possui permissão de "${required.action}" em "${required.module}"`
      )
    }

    return true
  }
}
