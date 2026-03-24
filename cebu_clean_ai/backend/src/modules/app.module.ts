import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { UsersModule } from '../users/users.module';
import { BinsModule } from '../bins/bins.module';
import { RewardsModule } from '../rewards/rewards.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { AiModule } from '../ai/ai.module';
import { IotModule } from '../iot/iot.module';
import { SchedulesModule } from '../schedules/schedules.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60, limit: 60 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    BinsModule,
    RewardsModule,
    AnalyticsModule,
    AiModule,
    IotModule,
    SchedulesModule,
  ],
})
export class AppModule {}
