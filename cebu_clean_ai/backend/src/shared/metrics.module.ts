import { Module } from '@nestjs/common';
import { Registry, collectDefaultMetrics } from 'prom-client';
import { MetricsController } from './metrics.controller';

const registry = new Registry();
collectDefaultMetrics({ register: registry });

@Module({
  providers: [{ provide: Registry, useValue: registry }],
  controllers: [MetricsController],
  exports: [Registry],
})
export class MetricsModule {}
