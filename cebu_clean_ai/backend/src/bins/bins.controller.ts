import { Controller, Get } from '@nestjs/common';
import { BinsService } from './bins.service';
import { BinStatus } from './dto/bin-status.dto';

@Controller('bins')
export class BinsController {
  constructor(private readonly service: BinsService) {}

  @Get()
  getAll(): BinStatus[] {
    return this.service.list();
  }
}
