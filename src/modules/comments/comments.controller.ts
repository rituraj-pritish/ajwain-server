import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { type RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('all/:id')
  getAll(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findAll(id);
  }

  @Post('create')
  create(@Body() body, @Req() req: RequestWithUser) {
    return this.commentsService.create({ ...body, userId: req.user.userId });
  }
}
