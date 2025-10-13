import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(body) {
    const user = await this.prisma.user.create({
      data: {
        ...body.user,
        role: 'PROJECT_ADMIN',
      },
    });

    const project = await this.prisma.project.create({
      data: body.project,
    });

    await this.prisma.usersOnProject.create({
      data: {
        userId: user.id,
        projectId: project.id,
      },
    });
  }
}
