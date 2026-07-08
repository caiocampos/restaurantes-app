import { PartialType, OmitType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

// "enabled" não é editável por aqui: existem rotas dedicadas
// (enable/disable) para deixar essa ação explícita e auditável.
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ["password"] as const),
) {}
