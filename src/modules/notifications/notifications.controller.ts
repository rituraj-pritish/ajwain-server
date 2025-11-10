import { Body, Controller, Get, Post, Req, Sse } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { type RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getNotifications(@Req() req: RequestWithUser) {
    return this.notificationsService.get(Number(req.user.userId));
  }

  @Post('archive')
  markAsArchived(@Body() body: { ids: number[] }) {
    return this.notificationsService.markArchived(body.ids);
  }

  @Sse('stream')
  stream(@Req() req: RequestWithUser) {
    return this.notificationsService.stream(Number(req.user.userId));
  }
}
