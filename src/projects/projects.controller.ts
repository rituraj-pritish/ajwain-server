import { Body, Controller, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './projects.schema';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Post()
  createProject(@Body() body: CreateProjectDto) {
    return this.projectService.createProject(body);
  }
}
