import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './users.schema';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  createUser(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
    });
  }
}
