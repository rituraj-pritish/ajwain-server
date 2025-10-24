import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  description: string;

  createdByUserId: number;

  @IsOptional()
  @IsISO8601()
  @ApiPropertyOptional()
  @Type(() => Date)
  date: Date;

  @ApiProperty()
  @IsNotEmpty()
  workspaceId: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  memberIds: string;
}

export class UpdateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description: string;

  @IsOptional()
  @IsISO8601()
  @ApiPropertyOptional()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  memberIds: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  @ApiPropertyOptional()
  status: TaskStatus;
}
