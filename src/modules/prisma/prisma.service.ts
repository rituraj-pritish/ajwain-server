import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    let adapter: PrismaLibSQL | null = null;
    if (process.env.NODE_ENV === 'production') {
      adapter = new PrismaLibSQL({
        url: process.env.TURSO_DATABASE_URL as string,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
      super({ adapter });
    }
  }

  async onModuleInit() {
    await this.$connect();
  }
}
