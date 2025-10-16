import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async createProject(body) {
    const hashedPassword = await this.authService.createPasswordHash(
      body.password,
    );

    const user = await this.prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: 'PROJECT_ADMIN',
      },
    });

    const project = await this.prisma.project.create({
      data: {
        name: body.projectName
      },
    });

    await this.prisma.usersOnProject.create({
      data: {
        userId: user.id,
        projectId: project.id,
      },
    });

    return this.authService.getToken(user.id);
  }
}
