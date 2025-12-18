import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { HealthModule } from './presentation/health/health.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './presentation/auth/auth.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    AuthModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
