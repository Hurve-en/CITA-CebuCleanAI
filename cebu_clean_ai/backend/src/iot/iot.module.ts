import { Module } from '@nestjs/common';
import { IotService } from './iot.service';
import { IotController } from './iot.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BinsModule } from '../bins/bins.module';

@Module({ imports: [PrismaModule, BinsModule], providers: [IotService], controllers: [IotController] })
export class IotModule {}
