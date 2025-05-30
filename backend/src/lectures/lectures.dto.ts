import { IsOptional, IsString, IsUrl } from 'class-validator';

export class GetDaysQueryDto {
  @IsString()
  year: string;

  @IsString()
  month: string;
}

export class CreateLectureDto {
  @IsString()
  date: string;

  @IsString()
  @IsOptional()
  repeatUntil: string;

  @IsString()
  start_time: string;

  @IsString()
  end_time: string;

  @IsString()
  @IsOptional()
  platform: string;

  @IsString()
  @IsOptional()
  corps: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsString()
  @IsOptional()
  groups: string;

  @IsString()
  @IsOptional()
  lectors: string;

  @IsUrl()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  stream_key: string;

  @IsString()
  @IsOptional()
  account: string;

  @IsString()
  @IsOptional()
  commentary: string;
}

export type UpdateLectureDto = Partial<CreateLectureDto>;
