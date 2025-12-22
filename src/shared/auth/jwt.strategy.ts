import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  //
  constructor(private readonly prisma: PrismaService) {
    console.log('JwtStrategy constructor called');
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key', // Must match!
    });
  }

  async validate(payload: any) {
    console.log('JwtStrategy validate called with payload:', payload);
    if (!payload || !payload.email || !payload.role) {
      throw new UnauthorizedException('Invalid token payload');
    } 
    
    const user = await this.prisma.user.findUnique({
    where: { email: payload.email ,role: payload.role },
    select: {
      id: true,
      email: true,
      role: true,
      organizationId: true,
      isActive: true,
    },
  });
  console.log('user--',user);
  

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid token');
    }
  return user;
}}

