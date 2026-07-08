import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Garante que existe um usuário autenticado (token JWT válido) na requisição.
 * Deve ser combinado com o PermissionsGuard para checar as permissões da role.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
