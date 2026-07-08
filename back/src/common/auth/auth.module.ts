import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { forceString } from "../utils";
import { getjwtExpiresIn, getjwtSecret } from "./jwt-env";

/**
 * Módulo global de autenticação: configura o JWT (assinatura e verificação)
 * e a estratégia do Passport uma única vez, disponibilizando JwtService,
 * PassportModule e JwtStrategy para qualquer módulo da aplicação sem a
 * necessidade de reimportar em cada feature module.
 */
@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: getjwtSecret(),
      signOptions: { expiresIn: getjwtExpiresIn() },
    }),
  ],
  providers: [JwtStrategy],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
