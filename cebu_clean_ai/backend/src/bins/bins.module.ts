import { Module } from '@nestjs/common';
import { BinsController } from './bins.controller';
import { BinsService } from './bins.service';
import { PrismaModule } from '../prisma/prisma.module';
import { BinsStream } from './bins.stream';

@Module({ imports: [PrismaModule], controllers: [BinsController], providers: [BinsService, BinsStream], exports: [BinsService, BinsStream] })
export class BinsModule {}
