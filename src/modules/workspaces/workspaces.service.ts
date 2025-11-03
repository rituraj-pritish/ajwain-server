import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateWorkspaceDto,
  DeleteWorkspaceDto,
  UpdateWorkspaceDto,
} from './workspaces.schema';
import { BoardsService } from '../boards/boards.service';

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly boardsService: BoardsService,
  ) {}

  findOne(id: number) {
    return this.prisma.workspace.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: CreateWorkspaceDto) {
    const existingWorkspace = await this.prisma.workspace.findFirst({
      where: {
        name: data.name,
        projectId: Number(data.projectId),
      },
    });

    if (existingWorkspace)
      throw new ConflictException('Workspace name already exists');

    return this.prisma.workspace.create({
      data,
    });
  }

  async update(data: UpdateWorkspaceDto, projectId: number) {
    const existingWorkspace = await this.prisma.workspace.findFirst({
      where: {
        name: data.name,
        projectId,
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

  async delete(data: DeleteWorkspaceDto) {
    await this.boardsService.deleteAllWithWorkspaceId(data.id);

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
        this.boardsService.deleteAllWithWorkspaceId(id),
      ),
    );

    return this.prisma.workspace.deleteMany({
      where: {
        projectId: id,
      },
    });
  }
}
