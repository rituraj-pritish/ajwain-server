import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.schema';
import { UsersService } from '../users/users.service';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) return new NotFoundException();

    const memberDetails = await this.getMemberDetails(task);

    return {
      ...task,
      ...memberDetails,
    };
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

  async update(data: UpdateTaskDto) {
    const task = await this.prisma.task.update({
      where: {
        id: data.id,
      },
      data,
    });

    const memberDetails = await this.getMemberDetails(task);

    return {
      ...task,
      ...memberDetails,
    };
  }

  async getMemberDetails(data: Task) {
    const members =
      data.memberIds && data.memberIds?.split(',').length > 0
        ? await Promise.all(
            data.memberIds
              ?.split(',')
              ?.map((id) => this.usersService.findOneWithId(Number(id))),
          )
        : [];

    const createdBy = await this.usersService.findOneWithId(
      Number(data.createdByUserId),
    );

    return {
      members,
      createdBy,
    };
  }
}
