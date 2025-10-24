import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateUserDto, SignInDto } from './users.schema';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  findOneWithEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  async createUser(data: CreateUserDto) {
    const hashedPassword = await this.authService.createPasswordHash(
      data.password,
    );

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async signin(data: SignInDto) {
    const user = await this.findOneWithEmail(data.email);

    if (!user) throw new UnauthorizedException();

    const isMatch = await this.authService.comparePassword(
      data.password,
      user.password,
    );

    if (!isMatch) throw new UnauthorizedException();

    const token = await this.authService.getToken({
      userId: user.id,
      projectId: user.projectId,
    });

    return token;
  }
}
