import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import e from 'express';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
   

    const payload = {
      id: user.id,
      role: user.role,
      email: user.email,
      organizationId: user.organizationId,
    };
    console.log('LOGIN USER ID:', user.id);

    console.log('LOGIN USER FROM DB:', user);
    console.log('JWT PAYLOAD:---', payload);


    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}



