import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, SignInDto, UserRole } from './users.schema';
import { type Response } from 'express';
import { Public } from '../auth/auth.decorator';
import { responseCookieConfig } from '../../common/response-cookie-config';
import { type RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @UseGuards(RolesGuard)
  @Roles([UserRole.PROJECT_ADMIN])
  createUser(@Body() data: CreateUserDto, @Req() req: RequestWithUser) {
    return this.usersService.createUser({
      ...data,
      projectId: req.user.projectId,
    });
  }

  @Get('details')
  getDetails(@Req() request: RequestWithUser) {
    return this.usersService.findOneWithId(request.user.userId);
  }

  @Get('all')
  getAll(@Req() request: RequestWithUser) {
    return this.usersService.findAll(request.user.projectId);
  }

  @Public()
  @Post('signin')
  async signin(
    @Res({ passthrough: true }) res: Response,
    @Body() data: SignInDto,
  ) {
    const token = await this.usersService.signin(data);
    res.cookie(process.env.JWT_COOKIE_NAME!, token, responseCookieConfig);

    return { message: 'Sign in successful' };
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(process.env.JWT_COOKIE_NAME!);

    response.status(201);
    return {
      message: 'Logout successful',
    };
  }
}
