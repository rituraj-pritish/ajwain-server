import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkspaceDto } from './workspaces.schema';

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateWorkspaceDto) {
    return this.prisma.workspace.create({
      data,
    });
  }
}
