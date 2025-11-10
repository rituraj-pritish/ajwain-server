import { Injectable } from '@nestjs/common';
import { filter, fromEvent, map, Observable } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateNotificationDto } from './notifications.schema';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(data: CreateNotificationDto) {
    await this.prisma.notification.create({
      data,
    });

    this.eventEmitter.emit('added', data);
  }

  get(id: number) {
    return this.prisma.notification.findMany({
      where: {
        userId: id,
      },
    });
  }

  markArchived(ids: number[]) {
    return Promise.all(
      ids.map((id) =>
        this.prisma.notification.update({
          where: {
            id,
          },
          data: {
            status: 'ARCHIVED',
          },
        }),
      ),
    );
  }

  stream(id: number): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'added').pipe(
      filter((payload: CreateNotificationDto) => {
        return payload.userId === id;
      }),
      map(
        (payload) =>
          new MessageEvent('message', {
            data: JSON.stringify(payload),
          } as MessageEventInit),
      ),
    );
  }
}
