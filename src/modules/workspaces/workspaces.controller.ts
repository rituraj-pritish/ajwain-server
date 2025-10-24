import { Body, Controller, Post, Req } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './workspaces.schema';
import { type RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post('create')
  createWorkspace(
    @Body() body: CreateWorkspaceDto,
    @Req() req: RequestWithUser,
  ) {
    return this.workspacesService.create({
      ...body,
      createdByUserId: req.user.userId,
      projectId: req.user.projectId,
    });
  }
}
