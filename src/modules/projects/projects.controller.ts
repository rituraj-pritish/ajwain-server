import { Body, Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './projects.schema';
import { Public } from '../auth/auth.decorator';
import { type Response } from 'express';
import { type RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { responseCookieConfig } from 'src/common/response-cookie-config';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Get('details')
  getDetails(@Req() request: RequestWithUser) {
    return this.projectService.findOne(request.user.projectId);
  }

  @Public()
  @Post('create')
  async createProject(
    @Res({ passthrough: true }) response: Response,
    @Body() body: CreateProjectDto,
  ) {
    const token = await this.projectService.createProject(body);

    response.cookie(process.env.JWT_COOKIE_NAME!, token, responseCookieConfig);

    return { message: 'Sign in successful' };
  }

  @Delete('delete')
  delete(
    @Res({ passthrough: true }) response: Response,
    @Req() request: RequestWithUser,
  ) {
    response.clearCookie(process.env.JWT_COOKIE_NAME!);
    response.status(201);

    return this.projectService.delete(Number(request.user.projectId));
  }
}
