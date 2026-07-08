import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { forceString } from '../utils';

/**
 * Módulo global de autenticação: configura o JWT (assinatura e verificação)
 * e a estratégia do Passport uma única vez, disponibilizando JwtService,
 * PassportModule e JwtStrategy para qualquer módulo da aplicação sem a
 * necessidade de reimportar em cada feature module.
 */
@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: forceString(process.env.JWT_SECRET, 'JWT_SECRET'),
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN ?? '1d' },
    }),
  ],
  providers: [JwtStrategy],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
