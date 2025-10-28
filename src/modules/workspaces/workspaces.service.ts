import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkspaceDto, DeleteWorkspaceDto } from './workspaces.schema';

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

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
      throw new ConflictException('Workspace already exists');

    return this.prisma.workspace.create({
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
}
