import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './projects.schema';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/users/users.schema';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

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

    const token = await this.authService.getToken(user.id);

    return {
      token,
    };
  }
}
