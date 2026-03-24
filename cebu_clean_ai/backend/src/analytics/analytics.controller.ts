import { Controller, Get } from '@nestjs/common';
import { IsNumber, IsString } from 'class-validator';

class HeatPointDto {
  @IsNumber() lat!: number;
  @IsNumber() lng!: number;
  @IsNumber() intensity!: number;
  @IsString() label!: string;
}

class Sdg11Dto {
  @IsNumber() diversionRate!: number;
  @IsNumber() collectionOnTime!: number;
  @IsNumber() illegalDumpSites!: number;
  @IsNumber() floodingAlerts!: number;
}

@Controller('analytics')
export class AnalyticsController {
  @Get('heatmap')
  heatmap(): HeatPointDto[] {
    return [
      { lat: 10.296, lng: 123.902, intensity: 0.9, label: 'Carbon Market' },
      { lat: 10.332, lng: 123.897, intensity: 0.6, label: 'Lahug' },
      { lat: 10.31, lng: 123.92, intensity: 0.7, label: 'Mabolo' },
    ];
  }

  @Get('sdg11')
  sdgReport(): Sdg11Dto {
    return { diversionRate: 0.34, collectionOnTime: 0.88, illegalDumpSites: 12, floodingAlerts: 2 };
  }
}
