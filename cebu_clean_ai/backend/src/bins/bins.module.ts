import { Module } from '@nestjs/common';
import { BinsController } from './bins.controller';
import { BinsService } from './bins.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({ imports: [PrismaModule], controllers: [BinsController], providers: [BinsService] })
export class BinsModule {}
