import { Body, Controller, Delete, Post, Req } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import {
  CreateWorkspaceDto,
  DeleteWorkspaceDto,
  GetWorkspaceDto,
} from './workspaces.schema';
import { type RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post('details')
  getDetails(@Body() body: GetWorkspaceDto) {
    return this.workspacesService.findOne(Number(body.id));
  }

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

  @Delete('delete')
  deleteWorkspace(@Body() body: DeleteWorkspaceDto) {
    return this.workspacesService.delete(body);
  }
}
