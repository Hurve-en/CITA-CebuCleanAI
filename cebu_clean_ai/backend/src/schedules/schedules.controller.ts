import { Controller, Get } from '@nestjs/common';

type Schedule = { day: string; type: string; window: string; notes?: string };

@Controller('schedules')
export class SchedulesController {
  @Get()
  list(): Schedule[] {
    return [
      { day: 'Mon / Thu', type: 'recyclable', window: '6:00–8:00 AM', notes: 'Blue bags only' },
      { day: 'Tue / Fri', type: 'residual', window: '7:00–9:00 PM', notes: 'Seal bags to avoid spills' },
    ];
  }
}
