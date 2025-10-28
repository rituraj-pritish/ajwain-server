import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

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

  projectId: number;
}

export class SignInDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
