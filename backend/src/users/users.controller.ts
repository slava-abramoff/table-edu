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
import { UsersService } from './users.service';
import { CreateUserDto, GetUsersQueryDto } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Создать пользователя
   */
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  /**
   * Получить список пользователей с пагинацией
   */
  @Get()
  async getAll(@Query() dto: GetUsersQueryDto) {
    return this.usersService.getAll(dto);
  }

  /**
   *  Изменить пользователя
   */
  @Patch(':id')
  async update(
    @Body() dto: CreateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.update(id, dto);
  }

  /**
   * Удалить пользователя
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
