import { Body, Controller, Post, Put, Req } from '@nestjs/common';
import { type RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { CreateTaskDto, UpdateTaskDto } from './tasks.schema';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

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
}
