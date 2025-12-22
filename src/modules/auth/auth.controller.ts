import { Controller, Post, Body, Get, Req } from '@nestjs/common';
//import { AuthService } from './auth.service';
import { LoginUseCase } from 'src/application/auth/login.usecase';

@Controller('auth')
export class AuthController {
  //constructor(private readonly authService: AuthService) {}
     constructor(private readonly loginUseCase: LoginUseCase) {}


  @Post('login')
  login(@Body() dto: { email: string; password: string }) {
    return this.loginUseCase.execute(dto.email, dto.password);
  }

  @Get('me')
  me(@Req() req) {
    return req.user;
  }
}


