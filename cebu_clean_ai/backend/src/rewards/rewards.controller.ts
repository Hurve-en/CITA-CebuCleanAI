import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { RewardsService, RewardActivity } from './rewards.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('rewards')
@UseGuards(JwtAuthGuard)
export class RewardsController {
  constructor(private readonly service: RewardsService) {}

  @Get('points')
  async getPoints(@Req() req: any) {
    const userId = req.user.userId as string;
    return { points: await this.service.points(userId) };
  }

  @Get('activity')
  getActivity(@Req() req: any): Promise<RewardActivity[]> {
    const userId = req.user.userId as string;
    return this.service.recent(userId);
  }
}
