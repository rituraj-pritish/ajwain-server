import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(id: number) {
    return this.prisma.comment.findMany({
      where: {
        taskId: id,
      },
    });
  }

  create(data: { taskId: number; userId: number; content: string }) {
    return this.prisma.comment.create({
      data,
    });
  }
}
