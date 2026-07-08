import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Role } from "../enums/role.enum";
import { getjwtSecret } from "./jwt-env";

export interface JwtPayload {
  sub: string;
  username: string;
  role: Role;
}

export interface RequestUser {
  userId: string;
  username: string;
  role: Role;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getjwtSecret(),
    });
  }

  // O retorno aqui é anexado automaticamente em request.user
  validate(payload: JwtPayload): RequestUser {
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
