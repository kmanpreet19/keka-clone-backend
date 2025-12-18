// import { Controller, Post, Body, Get, Req } from '@nestjs/common';
// import { AuthService } from './auth.service';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('login')
//   login(@Body() dto: { email: string; password: string }) {
//     return this.authService.login(dto.email, dto.password);
//   }

//   @Get('me')
//   me(@Req() req) {
//     return req.user;
//   }
// }
