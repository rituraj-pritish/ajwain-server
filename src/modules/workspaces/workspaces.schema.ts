import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateWorkspaceDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  createdByUserId: number;

  projectId: number;
}

export class DeleteWorkspaceDto {
  @IsNotEmpty()
  @ApiProperty()
  id: number;
}

export class GetWorkspaceDto {
  @IsNotEmpty()
  @ApiProperty()
  id: number;
}
