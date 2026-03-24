import { Controller, Get } from '@nestjs/common';
import { Registry } from 'prom-client';
import { Public } from '../auth/public.decorator';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly registry: Registry) {}

  @Get()
  @Public()
  async metrics() {
    return this.registry.metrics();
  }
}
