import { Injectable } from '@nestjs/common';
import { BinStatus } from './dto/bin-status.dto';

@Injectable()
export class BinsService {
  list(): BinStatus[] {
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
}
