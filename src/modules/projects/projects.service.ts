import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateProjectDto } from './projects.schema';
import { UsersService } from 'src/modules/users/users.service';
import { UserRole } from 'src/modules/users/users.schema';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  findOne(id: number) {
    return this.prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        workspaces: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async createProject(body: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: {
        name: body.projectName,
      },
    });

    const user = await this.usersService.createUser({
      name: body.name,
      email: body.email,
      password: body.password,
      role: UserRole.PROJECT_ADMIN,
      projectId: project.id,
    });

    const token = await this.authService.getToken({
      userId: user.id,
      projectId: project.id,
    });

    return token;
  }
}
