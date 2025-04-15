import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateConferenceDto {
  @IsString()
  event_name: string;

  @IsString()
  full_name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  start_date: string;

  @IsString()
  start_time: string;

  @IsString()
  end_date: string;

  @IsString()
  end_time: string;

  @IsString()
  location: string;

  @IsString()
  platform: string;

  @IsString()
  @IsOptional()
  devices?: string;

  @IsString()
  @IsOptional()
  commentary?: string;
}

export class UpdateConferenceDto extends PartialType(CreateConferenceDto) {
  @IsString()
  @IsOptional()
  status?: string;

  @IsUrl()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  user?: string;
}

export class GetConferenceQueryDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1; // Номер страницы (по умолчанию 1)

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10; // Количество товаров на странице (по умолчанию 10)

  @IsString()
  @IsOptional()
  sortBy: string = 'start_date'; // Поле для сортировки (по умолчанию createdAt)

  @IsString()
  @IsOptional()
  sortOrder: 'asc' | 'desc' = 'desc'; // Порядок сортировки (по умолчанию desc)
}
