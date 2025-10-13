import { Body, Controller, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Post()
  createProject(@Body() body) {
    return this.projectService.createProject(body);
  }
}
