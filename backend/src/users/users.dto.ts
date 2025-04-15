import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsString, Min } from 'class-validator';

enum RoleType {
  viewer = 'viewer',
  admin = 'admin',
  moderator = 'moderator',
}

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEnum(RoleType)
  role: RoleType;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class GetUsersQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number;
}
