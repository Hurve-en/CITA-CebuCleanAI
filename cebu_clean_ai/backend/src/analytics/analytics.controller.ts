import { Controller, Get } from '@nestjs/common';

type HeatPoint = { lat: number; lng: number; intensity: number; label: string };

@Controller('analytics')
export class AnalyticsController {
  @Get('heatmap')
  heatmap(): HeatPoint[] {
    return [
      { lat: 10.296, lng: 123.902, intensity: 0.9, label: 'Carbon Market' },
      { lat: 10.332, lng: 123.897, intensity: 0.6, label: 'Lahug' },
      { lat: 10.310, lng: 123.920, intensity: 0.7, label: 'Mabolo' },
    ];
  }

  @Get('sdg11')
  sdgReport() {
    return {\n      diversionRate: 0.34,\n      collectionOnTime: 0.88,\n      illegalDumpSites: 12,\n      floodingAlerts: 2,\n    };\n  }\n}\n*** End Patch
