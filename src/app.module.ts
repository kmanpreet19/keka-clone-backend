import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthModule } from './presentation/health/health.module';

import { AppService } from './app.service';
import { AuthModule } from './presentation/auth/auth.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './shared/auth/jwt.guard';
import { RolesGuard } from './shared/auth/roles.guard';
import { UsersModule } from './modules/users/users.module';
import { InvitationsModule } from './modules/invitations/invitations.module';

@Module({

  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    AuthModule,
    PrismaModule,
    UsersModule,
    InvitationsModule
  ],

   providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },

     AppService,
  ],



  //controllers: [AppController],

})
export class AppModule {}
