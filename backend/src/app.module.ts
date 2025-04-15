import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { ConferencesModule } from './conferences/conferences.module';
import { UsersModule } from './users/users.module';
import { LecturesModule } from './lectures/lectures.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    ConferencesModule,
    UsersModule,
    LecturesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
