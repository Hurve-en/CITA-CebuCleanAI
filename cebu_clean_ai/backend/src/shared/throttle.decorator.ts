import { applyDecorators, UseGuards } from '@nestjs/common';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';

export const RateLimit = (limit = 30, ttl = 60) =>
  applyDecorators(Throttle(limit, ttl), UseGuards(ThrottlerGuard));
