import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ConferencesModule } from './conferences/conferences.module';
import { UsersModule } from './users/users.module';
import { LecturesModule } from './lectures/lectures.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    PrismaModule,
    ConferencesModule,
    UsersModule,
    LecturesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
