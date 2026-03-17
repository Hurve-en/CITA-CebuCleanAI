import { Controller, Get } from '@nestjs/common';
import { IotService } from './iot.service';
import { Telemetry } from './iot.service';

@Controller('iot')
export class IotController {
  constructor(private readonly service: IotService) {}

  @Get('latest')
  latest(): Telemetry[] {
    return this.service.recent();
  }
}
