import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateLectureDto,
  GetDaysQueryDto,
  UpdateLectureDto,
} from './lectures.dto';

export interface LectureDay {
  date: string;
  lections_count: number;
  groups: string[];
  lectors: string[];
}

export interface AvailableYearsMonths {
  years: Record<number, number[]>;
}

export interface Days {
  days: LectureDay[];
  available: AvailableYearsMonths;
}

@Injectable()
export class LecturesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Создать лекцию
   * @param dto DTO для валидации данных
   * @returns лекция
   */
  async create(dto: CreateLectureDto) {
    const { isRecurring, ...rest } = dto;

    if (isRecurring) {
      // TODO: реализовать рекурсивное создание лекций
    }

    return await this.prisma.lectures.create({
      data: {
        ...rest,
      },
    });
  }

  /**
   * Получить список доступных дат в расписании
   * @returns
   */
  async getAvailableYearsMonths(): Promise<AvailableYearsMonths> {
    // Получаем все уникальные даты
    const dates = await this.prisma.lectures.findMany({
      select: {
        date: true,
      },
      distinct: ['date'],
    });

    const result: AvailableYearsMonths = {
      years: {},
    };

    dates.forEach(({ date }) => {
      const [yearStr, monthStr] = date.split('-');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);

      if (!result.years[year]) {
        result.years[year] = [];
      }

      if (!result.years[year].includes(month)) {
        result.years[year].push(month);
      }
    });

    // Сортируем года по возрастанию
    const sortedYears = Object.keys(result.years)
      .map(Number)
      .sort((a, b) => a - b);

    // Сортируем месяцы внутри каждого года
    const finalResult: AvailableYearsMonths = {
      years: {},
    };

    sortedYears.forEach((year) => {
      finalResult.years[year] = result.years[year].sort((a, b) => a - b);
    });

    return finalResult;
  }

  /**
   * Получить дни проведения лекций
   * @returns
   */
  async getDays(query: GetDaysQueryDto): Promise<Days> {
    const { year, month } = query;
    const where: any = {};

    if (year) {
      where.date = {
        startsWith: year, // Фильтр по году (2025-...)
      };
    }

    if (month) {
      const monthPattern = `-${month.padStart(2, '0')}-`; // Форматируем месяц (03 -> -03-)
      where.date = {
        ...where.date,
        contains: monthPattern, // Фильтр по месяцу (-03-)
      };
    }

    const lectures = await this.prisma.lectures.findMany({
      where, // Применяем фильтры
      select: {
        date: true,
        groups: true,
        lectors: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Группировка по дате с явным указанием типа аккумулятора
    const groupedByDate = lectures.reduce<LectureDay[]>((acc, lecture) => {
      const existingEntry = acc.find((item) => item.date === lecture.date);

      if (existingEntry) {
        existingEntry.lections_count += 1;

        // Добавляем группу, если она есть и еще не добавлена
        if (lecture.groups && !existingEntry.groups.includes(lecture.groups)) {
          existingEntry.groups.push(lecture.groups);
        }

        // Добавляем лекторов, если они есть и еще не добавлены
        if (lecture.lectors) {
          const lectors = lecture.lectors.split(',').map((l) => l.trim());
          lectors.forEach((lector) => {
            if (!existingEntry.lectors.includes(lector)) {
              existingEntry.lectors.push(lector);
            }
          });
        }
      } else {
        acc.push({
          date: lecture.date,
          lections_count: 1,
          groups: lecture.groups ? [lecture.groups] : [],
          lectors: lecture.lectors
            ? lecture.lectors.split(',').map((l) => l.trim())
            : [],
        });
      }

      return acc;
    }, []);

    const availableDates = await this.getAvailableYearsMonths();
    return {
      days: groupedByDate,
      available: availableDates,
    };
  }

  /**
   * Получить лекции на день
   * @param date Дата
   * @returns массив лекций
   */
  async getDay(date: string) {
    return await this.prisma.lectures.findMany({
      where: {
        date,
      },
    });
  }

  /**
   * Изменить лекцию
   * @param id ID лекции
   * @param dto DTO для валидации данных
   * @returns измененная лекция
   */
  async update(id: number, dto: UpdateLectureDto) {
    return await this.prisma.lectures.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  /**
   * Удалить лекцию
   * @param id ID лекцию
   * @returns удалённая лекция
   */
  async remove(id: number) {
    try {
      const lecture = await this.prisma.lectures.delete({
        where: {
          id,
        },
      });
      return lecture;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.CONFLICT);
    }
  }
}
