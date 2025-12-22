import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Public } from '../../shared/auth/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    console.log(' Login endpoint HIT - Public route');
    console.log('Login attempt:', loginDto.email);

    // TODO: Validate credentials against database
    if (loginDto.email !== 'admin@test.com' || loginDto.password !== 'password123') {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create JWT payload
    const payload = {
      sub: '123',
      email: loginDto.email,
      role: 'ADMIN',
    };

    // Generate JWT token (will use secret from JwtModule)
    const access_token = this.jwtService.sign(payload);

    console.log('JWT Token generated');
    console.log(' Token:', access_token);

    return {
      access_token,
      user: {
        email: loginDto.email,
        role: 'ADMIN',
      },
    };
  }
}