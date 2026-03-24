import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ScheduleDto } from './dto/schedule.dto';

@Controller('schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchedulesController {
  @Get()
  list(): ScheduleDto[] {
    return [
      { day: 'Mon / Thu', type: 'recyclable', window: '6:00–8:00 AM', notes: 'Blue bags only' },
      { day: 'Tue / Fri', type: 'residual', window: '7:00–9:00 PM', notes: 'Seal bags to avoid spills' },
    ];
  }

  @Post()
  @Roles('admin', 'officer')
  create(@Body() dto: ScheduleDto) {
    return dto;
  }

  @Put(':day')
  @Roles('admin', 'officer')
  update(@Param('day') day: string, @Body() dto: ScheduleDto) {
    return { ...dto, day };
  }

  @Delete(':day')
  @Roles('admin')
  remove(@Param('day') day: string) {
    return { deleted: day };
  }
}
