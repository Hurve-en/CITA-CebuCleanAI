import { Injectable } from '@nestjs/common';
import { BinStatus } from './dto/bin-status.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BinsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<BinStatus[]> {
    const bins = await this.prisma.smartBin.findMany();
    if (bins.length === 0) {
      return [
        {
          code: 'CB-101',
          barangay: 'Lahug',
          fillLevel: 76,
          status: 'online',
          latitude: 10.332,
          longitude: 123.897,
          temperature: 32.1,
          collectionEtaMinutes: 14,
        },
        {
          code: 'CB-204',
          barangay: 'Carbon',
          fillLevel: 92,
          status: 'alert',
          latitude: 10.296,
          longitude: 123.902,
          temperature: 35.4,
          collectionEtaMinutes: 6,
        },
      ];
    }
    return bins.map((b) => ({
      code: b.code,
      barangay: b.barangay,
      fillLevel: b.fillLevel,
      status: (b.status as BinStatus['status']) ?? 'online',
      latitude: b.latitude,
      longitude: b.longitude,
      temperature: b.temperature,
      collectionEtaMinutes: 10,
    }));
  }
}
