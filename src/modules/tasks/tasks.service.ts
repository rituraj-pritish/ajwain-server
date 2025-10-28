import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.schema';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: number) {
    return this.prisma.task.findUnique({
      where: {
        id,
      },
    });
  }

  getAll(workspaceId: number) {
    return this.prisma.task.findMany({
      where: {
        workspaceId,
      },
    });
  }

  create(data: CreateTaskDto) {
    return this.prisma.task.create({
      data,
    });
  }

  update(data: UpdateTaskDto) {
    return this.prisma.task.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
}
