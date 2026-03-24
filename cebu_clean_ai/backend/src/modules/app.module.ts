import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { UsersModule } from '../users/users.module';
import { BinsModule } from '../bins/bins.module';
import { RewardsModule } from '../rewards/rewards.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { AiModule } from '../ai/ai.module';
import { IotModule } from '../iot/iot.module';
import { SchedulesModule } from '../schedules/schedules.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { HealthModule } from '../health/health.module';
import { LoggerModule } from '../shared/logger.module';
import { MetricsModule } from '../shared/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60, limit: 60 }]),
    PrismaModule,
    AuthModule,
    LoggerModule,
    MetricsModule,
    UsersModule,
    BinsModule,
    RewardsModule,
    AnalyticsModule,
    AiModule,
    IotModule,
    SchedulesModule,
    HealthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
