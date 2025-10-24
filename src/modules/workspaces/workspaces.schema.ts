import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateWorkspaceDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  createdByUserId: number;

  projectId: number;
}
