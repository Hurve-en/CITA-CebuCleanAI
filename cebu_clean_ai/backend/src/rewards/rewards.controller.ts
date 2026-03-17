import { Controller, Get } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { RewardActivity } from './rewards.service';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly service: RewardsService) {}

  @Get('points')
  getPoints() {
    return { points: this.service.points() };
  }

  @Get('activity')
  getActivity(): RewardActivity[] {
    return this.service.recent();
  }
}
