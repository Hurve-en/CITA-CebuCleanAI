import { Body, Controller, Delete, Get, Param, Post, Put, Sse, UseGuards } from '@nestjs/common';
import { BinsService } from './bins.service';
import { BinStatus } from './dto/bin-status.dto';
import { BinsStream } from './bins.stream';
import { map } from 'rxjs/operators';
import { CreateBinDto } from './dto/bin-create.dto';
import { UpdateBinDto } from './dto/bin-update.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bins')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BinsController {
  constructor(private readonly service: BinsService, private readonly stream: BinsStream) {}

  @Get()
  getAll(): Promise<BinStatus[]> {
    return this.service.list();
  }

  @Post()
  @Roles('admin', 'officer')
  create(@Body() dto: CreateBinDto) {
    return this.service.create(dto);
  }

  @Put(':code')
  @Roles('admin', 'officer')
  update(@Param('code') code: string, @Body() dto: UpdateBinDto) {
    return this.service.update(code, dto);
  }

  @Delete(':code')
  @Roles('admin')
  remove(@Param('code') code: string) {
    return this.service.remove(code);
  }

  @Sse('stream')
  stream() {
    return this.stream.asObservable().pipe(map((data) => ({ data })));
  }
}
