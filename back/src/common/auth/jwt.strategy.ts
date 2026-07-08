import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '../enums/role.enum';
import { forceString } from '../utils';

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
      secretOrKey: forceString(process.env.JWT_SECRET, 'JWT_SECRET'),
    });
  }

  // O retorno aqui é anexado automaticamente em request.user
  validate(payload: JwtPayload): RequestUser {
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
