import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { LoginUseCase } from '../../application/auth/login.usecase';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '3600', 10) },
    }),
  ],
  controllers: [AuthController],
  providers: [LoginUseCase],
})
export class AuthModule {}
