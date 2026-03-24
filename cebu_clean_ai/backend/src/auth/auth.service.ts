import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async validateUser(email: string, role?: 'resident' | 'officer' | 'admin') {
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.user.create({ data: { email, role: role ?? 'resident' } });
    }
    return user;
  }

  async login(email: string, role?: 'resident' | 'officer' | 'admin') {
    const user = await this.validateUser(email, role);
    if (!user) throw new UnauthorizedException();
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwt.sign(payload) };
  }
}
