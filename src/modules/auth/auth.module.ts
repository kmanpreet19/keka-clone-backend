import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '../../presentation/auth/auth.controller';
import { LoginUseCase } from '../../application/auth/login.usecase';
import { JwtStrategy } from '../../shared/auth/jwt.strategy';

@Module({
  imports: [

    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: '10d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    JwtStrategy, //  registers "jwt"
  ],
})
export class AuthModule {}
