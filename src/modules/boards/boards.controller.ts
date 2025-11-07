import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { type RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get('details/:id')
  getDetails(@Param('id', ParseIntPipe) id: number) {
    return this.boardsService.findOne(id);
  }

  @Post('create')
  create(
    @Body() body: { name: string; workspaceId: number },
    @Req() req: RequestWithUser,
  ) {
    return this.boardsService.create({
      ...body,
      createdByUserId: req.user.userId,
    });
  }

  @Put('update')
  update(@Body() body: { id: number; name: string; workspaceId: number }) {
    return this.boardsService.update(body);
  }

  @Delete('delete/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.boardsService.delete(id);
  }
}
