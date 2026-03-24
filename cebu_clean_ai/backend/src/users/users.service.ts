import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.user.findMany();
  }

  create(user: { email: string; role?: 'resident' | 'officer' | 'admin' }) {
    return this.prisma.user.create({
      data: { email: user.email, role: user.role ?? 'resident' },
    });
  }
}
