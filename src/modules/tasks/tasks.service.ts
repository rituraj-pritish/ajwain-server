import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.schema';
import { UsersService } from '../users/users.service';
import { Task, TaskStatus } from '@prisma/client';

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

  getAll(boardId: number) {
    return this.prisma.task.findMany({
      where: {
        boardId,
      },
    });
  }

  create(data: CreateTaskDto) {
    return this.prisma.task.create({
      data,
    });
  }

  updateStatus(data: { id: number; status: TaskStatus }) {
    return this.prisma.task.update({
      where: {
        id: data.id,
      },
      data: {
        status: data.status,
      },
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

  async deleteAllWithBoardId(id: number) {
    const boards = await this.prisma.board.findMany({
      where: {
        workspaceId: id,
      },
    });

    return Promise.all(
      boards.map((board) =>
        this.prisma.task.deleteMany({
          where: {
            boardId: board.id,
          },
        }),
      ),
    );
  }

  delete(id: number) {
    return this.prisma.task.delete({
      where: {
        id,
      },
    });
  }
}
