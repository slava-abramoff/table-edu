import { Module } from '@nestjs/common';
import { ConferencesService } from './conferences.service';
import { ConferencesController } from './conferences.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ConferencesController],
  providers: [ConferencesService, PrismaService],
})
export class ConferencesModule {}
