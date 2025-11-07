import { Body, Controller, Delete, Post, Put, Req } from '@nestjs/common';
import { type RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { CreateTaskDto, UpdateTaskDto } from './tasks.schema';
import { TasksService } from './tasks.service';
import { TaskStatus } from '@prisma/client';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('details')
  getDetails(@Body() body: { id: string }) {
    return this.tasksService.findOne(Number(body.id));
  }

  @Post('all')
  getTasks(@Body() body: { workspaceId: number }) {
    {
      return this.tasksService.getAll(body.workspaceId);
    }
  }

  @Post('create')
  create(@Req() req: RequestWithUser, @Body() body: CreateTaskDto) {
    return this.tasksService.create({
      ...body,
      createdByUserId: req.user.userId,
    });
  }

  @Put('update')
  update(@Body() body: UpdateTaskDto) {
    return this.tasksService.update(body);
  }

  @Put('status/update')
  statusUpdate(@Body() body: { id: number; status: TaskStatus }) {
    return this.tasksService.updateStatus(body);
  }

  @Delete('delete')
  delete(@Body() body: { id: number }) {
    return this.tasksService.delete(body.id);
  }
}
