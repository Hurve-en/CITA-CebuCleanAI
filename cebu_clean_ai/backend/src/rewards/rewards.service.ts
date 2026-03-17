import { Injectable } from '@nestjs/common';

export type RewardActivity = {
  type: string;
  message: string;
  delta: number;
  at: string;
};

@Injectable()
export class RewardsService {
  points(): number {
    return 120;
  }

  recent(): RewardActivity[] {
    return [
      { type: 'scan', message: 'Plastic bottle classified', delta: 10, at: new Date().toISOString() },
      { type: 'report', message: 'Overflowing bin reported', delta: 30, at: new Date().toISOString() },
    ];
  }
}
