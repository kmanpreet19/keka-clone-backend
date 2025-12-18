// ...existing code...
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

// require at runtime to avoid import/typing mismatch if client isn't generated
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require('@prisma/client');

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // runtime client and model shortcuts used elsewhere (e.g. prisma.user)
  public prisma: any;
  public user: any;

  constructor() {
    this.prisma = new PrismaClient();
    this.user = this.prisma.user;
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
// ...existing code...