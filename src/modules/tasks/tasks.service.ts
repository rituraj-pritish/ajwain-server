import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.schema';
import { UsersService } from '../users/users.service';
import { Task, TaskStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
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

  async createTaskNotification(task: Task) {
    if (task.memberIds && task.memberIds.split(',').length > 0) {
      const board = await this.prisma.board.findUnique({
        where: {
          id: task.boardId!,
        },
        include: {
          workspace: true,
        },
      });

      await Promise.all(
        task.memberIds.split(',').map((id) =>
          this.notificationsService.create({
            userId: Number(id),
            boardId: task.boardId!,
            boardName: board!.name,
            workspaceId: board!.workspaceId,
            workspaceName: board!.workspace.name,
            taskId: task.id,
            taskTitle: task.title,
          }),
        ),
      );
    }
  }

  async create(data: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data,
    });

    await this.createTaskNotification(task);
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

    await this.createTaskNotification(task);

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
