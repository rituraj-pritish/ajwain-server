import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateWorkspaceDto,
  DeleteWorkspaceDto,
  UpdateWorkspaceDto,
} from './workspaces.schema';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tasksService: TasksService,
  ) {}

  findOne(id: number) {
    return this.prisma.workspace.findUnique({
      where: {
        id,
      },
      include: {
        tasks: true,
      },
    });
  }

  async create(data: CreateWorkspaceDto) {
    const existingWorkspace = await this.prisma.workspace.findFirst({
      where: {
        name: data.name,
      },
    });

    if (existingWorkspace)
      throw new ConflictException('Workspace name already exists');

    return this.prisma.workspace.create({
      data,
    });
  }

  async update(data: UpdateWorkspaceDto) {
    const existingWorkspace = await this.prisma.workspace.findFirst({
      where: {
        name: data.name,
      },
    });

    if (existingWorkspace)
      throw new ConflictException('Workspace name already exists');

    return this.prisma.workspace.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  delete(data: DeleteWorkspaceDto) {
    return this.prisma.workspace.delete({
      where: {
        id: data.id,
      },
    });
  }

  async deleteAllWithProjectId(id: number) {
    const workspaces = await this.prisma.workspace.findMany({
      where: {
        projectId: id,
      },
    });

    await Promise.all(
      workspaces.map(({ id }) =>
        this.tasksService.deleteAllWithWorkspaceId(id),
      ),
    );

    return this.prisma.workspace.deleteMany({
      where: {
        projectId: id,
      },
    });
  }
}
