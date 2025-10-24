import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { UsersModule } from 'src/modules/users/users.module';
import { ProjectsModule } from 'src/modules/projects/projects.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { WorkspacesModule } from 'src/modules/workspaces/workspaces.module';
import { AuthGuard } from './modules/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ProjectsModule,
    AuthModule,
    WorkspacesModule,
    TasksModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
