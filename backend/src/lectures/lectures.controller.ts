import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Days, LecturesService } from './lectures.service';
import {
  CreateLectureDto,
  GetDaysQueryDto,
  UpdateLectureDto,
} from './lectures.dto';

@Controller('lectures')
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  /**
   * Запланировать лекцию
   */
  @Post()
  async create(@Body() dto: CreateLectureDto) {
    return await this.lecturesService.create(dto);
  }

  /**
   * Получить расписание
   */
  @Get('schedule')
  async getAllDays(@Query() dto: GetDaysQueryDto): Promise<Days> {
    return await this.lecturesService.getDays(dto);
  }

  /**
   * Получить расписание на день
   */
  @Get('schedule/:date')
  async getDay(@Param('date') date: string) {
    return await this.lecturesService.getDay(date);
  }

  /**
   *  Изменить лекцию
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLectureDto,
  ) {
    return await this.lecturesService.update(id, dto);
  }

  /**
   * Удалить лекцию
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.lecturesService.remove(id);
  }
}
