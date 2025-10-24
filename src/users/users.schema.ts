import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export enum UserRole {
  PROJECT_ADMIN = 'PROJECT_ADMIN',
  MEMBER = 'MEMBER',
}

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  projectId: number;
}
