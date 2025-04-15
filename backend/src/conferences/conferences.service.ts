import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateConferenceDto,
  GetConferenceQueryDto,
  UpdateConferenceDto,
} from './conferences.dto';

@Injectable()
export class ConferencesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Создать конференцию
   * @param dto DTO для валидации данных
   * @returns созданная конференция
   */
  async create(dto: CreateConferenceDto) {
    return await this.prisma.confs.create({
      data: dto,
    });
  }

  /**
   * Получить список конференций
   * @param query Запрос для пагинации
   * @returns список конференций
   */
  async getAll(query: GetConferenceQueryDto) {
    let { page, limit, sortBy, sortOrder } = query;

    const offset = (page - 1) * limit;

    page = page || 1;
    limit = limit || 10;
    sortBy = sortBy || 'start_date';
    sortOrder = sortOrder || 'desc';

    const [conferences, total] = await Promise.all([
      this.prisma.product.findMany({
        skip: offset,
        take: Number(limit),
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.product.count(),
    ]);

    // Рассчитываем общее количество страниц
    const totalPages = Math.ceil(total / limit);

    // Возвращаем объект с данными для пагинации
    return {
      data: conferences,
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
   * Изменить конференцию
   * @param id ID конференции
   * @param dto DTO для валидации данных
   * @returns удалённая концференция
   */
  async update(id: number, dto: UpdateConferenceDto) {
    return await this.prisma.confs.update({
      where: { id },
      data: { ...dto },
    });
  }

  /**
   * Удалить конференцию
   * @param id ID конференции
   * @returns удалённая конференция
   */
  async remove(id: number) {
    try {
      const conference = await this.prisma.confs.delete({
        where: {
          id,
        },
      });
      return conference;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.CONFLICT);
    }
  }
}
