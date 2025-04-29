import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto, GetUsersQueryDto, UpdateUserDto } from './users.dto';
import { users } from '@prisma/client';

@Injectable()
export class UsersService {
  async checkExisting(id: number): Promise<users> {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  constructor(private prisma: PrismaService) {}

  /**
   * Создать пользователя
   * @param dto DTO для валидации данных
   * @returns пользователь
   */
  async create(dto: CreateUserDto): Promise<users> {
    return await this.prisma.users.create({
      data: dto,
    });
  }

  /**
   * Получить пользователя
   * @param id ID пользователя
   * @returns пользователь
   */
  async getOne(username: string): Promise<any> {
    return await this.prisma.users.findUnique({
      where: { username },
    });
  }

  /**
   * Получить список пользователей
   * @param query Запрос
   * @returns список пользователей с пагинацией
   */
  async getAll(query: GetUsersQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const offset = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.notification.findMany({
        skip: offset,
        take: Number(limit),
      }),
      this.prisma.notification.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems: total,
        itemsPerPage: Number(limit),
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Изменить пользователя
   * @param id ID пользователя
   * @param dto DTO для валидации данных
   * @returns пользователь
   */
  async update(id: number, dto: UpdateUserDto): Promise<users> {
    return await this.prisma.users.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Удалить пользователя
   * @param id ID пользователя
   * @returns пользователь
   */
  async remove(id: number): Promise<users> {
    const user = await this.checkExisting(id);

    if (user.role === 'admin') {
      throw new HttpException(
        'Admin cannot be deleted',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prisma.users.delete({
      where: { id },
    });
  }
}
