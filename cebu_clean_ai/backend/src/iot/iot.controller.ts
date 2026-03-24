import { Controller, Get, UseGuards } from '@nestjs/common';
import { IotService, TelemetryDto } from './iot.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('iot')
@UseGuards(JwtAuthGuard)
export class IotController {
  constructor(private readonly service: IotService) {}

  @Get('latest')
  latest(): TelemetryDto[] {
    return this.service.recent();
  }
}
