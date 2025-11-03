import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TasksService } from '../tasks/tasks.service';
import { CreateBoardDto } from './boards.schema';

@Injectable()
export class BoardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tasksService: TasksService,
  ) {}

  findOne(id: number) {
    return this.prisma.board.findUnique({
      where: {
        id,
      },
      include: {
        tasks: true,
        workspace: true,
      },
    });
  }

  create(data: CreateBoardDto) {
    return this.prisma.board.create({
      data,
    });
  }

  update(data: { id: number; name: string }) {
    return this.prisma.board.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  delete(id: number) {
    return this.prisma.board.delete({
      where: {
        id,
      },
    });
  }

  async deleteAllWithWorkspaceId(id: number) {
    const boards = await this.prisma.board.findMany({
      where: {
        workspaceId: id,
      },
    });

    await Promise.all(
      boards.map(({ id }) => this.tasksService.deleteAllWithBoardId(id)),
    );

    return this.prisma.board.deleteMany({
      where: {
        workspaceId: id,
      },
    });
  }
}
