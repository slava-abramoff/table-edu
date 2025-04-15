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
import { ConferencesService } from './conferences.service';
import {
  CreateConferenceDto,
  GetConferenceQueryDto,
  UpdateConferenceDto,
} from './conferences.dto';

@Controller('conferences')
export class ConferencesController {
  constructor(private readonly conferencesService: ConferencesService) {}

  /**
   * Создать конференцию
   */
  @Post()
  async create(@Body() dto: CreateConferenceDto) {
    return await this.conferencesService.create(dto);
  }

  /**
   * Получить список конференций
   */
  @Get()
  async getAll(@Query() query: GetConferenceQueryDto) {
    return await this.conferencesService.getAll(query);
  }

  /**
   * Изменить конференцию
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConferenceDto,
  ) {
    return await this.conferencesService.update(id, dto);
  }

  /**
   * Удалить конференцию
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.conferencesService.remove(id);
  }
}
