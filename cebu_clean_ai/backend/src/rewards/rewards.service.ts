import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type RewardActivity = {
  label: string;
  delta: number;
  createdAt: string;
};

@Injectable()
export class RewardsService {
  constructor(private readonly prisma: PrismaService) {}

  async points(userId: string): Promise<number> {
    const agg = await this.prisma.reward.aggregate({
      where: { userId },
      _sum: { delta: true },
    });
    return agg._sum.delta ?? 0;
  }

  async recent(userId: string): Promise<RewardActivity[]> {
    const rows = await this.prisma.reward.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return rows.map((r) => ({ label: r.label, delta: r.delta, createdAt: r.createdAt.toISOString() }));
  }

  award(userId: string, label: string, delta: number) {
    return this.prisma.reward.create({ data: { userId, label, delta } });
  }
}
