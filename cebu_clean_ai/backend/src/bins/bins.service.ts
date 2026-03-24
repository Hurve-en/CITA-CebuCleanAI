import { Injectable } from '@nestjs/common';
import { BinStatus } from './dto/bin-status.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BinsStream } from './bins.stream';
import { CreateBinDto } from './dto/bin-create.dto';
import { UpdateBinDto } from './dto/bin-update.dto';

@Injectable()
export class BinsService {
  constructor(private readonly prisma: PrismaService, private readonly stream: BinsStream) {}

  async list(): Promise<BinStatus[]> {
    const bins = await this.prisma.smartBin.findMany();
    if (bins.length === 0) {
      return [
        {
          code: 'CB-101',
          barangay: 'Lahug',
          fillLevel: 76,
          status: 'online',
          latitude: 10.332,
          longitude: 123.897,
          temperature: 32.1,
          collectionEtaMinutes: 14,
        },
        {
          code: 'CB-204',
          barangay: 'Carbon',
          fillLevel: 92,
          status: 'alert',
          latitude: 10.296,
          longitude: 123.902,
          temperature: 35.4,
          collectionEtaMinutes: 6,
        },
      ];
    }
    return bins.map((b) => ({
      code: b.code,
      barangay: b.barangay,
      fillLevel: b.fillLevel,
      status: (b.status as BinStatus['status']) ?? 'online',
      latitude: b.latitude,
      longitude: b.longitude,
      temperature: b.temperature,
      collectionEtaMinutes: 10,
    }));
  }

  create(dto: CreateBinDto) {
    return this.prisma.smartBin.create({ data: dto });
  }

  update(code: string, dto: UpdateBinDto) {
    return this.prisma.smartBin.update({ where: { code }, data: dto });
  }

  async remove(code: string) {
    await this.prisma.telemetry.deleteMany({ where: { bin: { code } } });
    return this.prisma.smartBin.delete({ where: { code } });
  }

  async upsertFromTelemetry(payload: {
    code: string;
    barangay?: string;
    fill: number;
    temperature: number;
    battery: number;
    lat: number;
    lng: number;
  }) {
    const bin = await this.prisma.smartBin.upsert({
      where: { code: payload.code },
      update: {
        fillLevel: payload.fill,
        temperature: payload.temperature,
        battery: payload.battery,
        latitude: payload.lat,
        longitude: payload.lng,
        lastSeenAt: new Date(),
        status: payload.fill >= 90 ? 'alert' : 'online',
      },
      create: {
        code: payload.code,
        barangay: payload.barangay ?? 'Unknown',
        latitude: payload.lat,
        longitude: payload.lng,
        fillLevel: payload.fill,
        temperature: payload.temperature,
        battery: payload.battery,
      },
    });
    await this.prisma.telemetry.create({
      data: {
        binId: bin.id,
        fill: payload.fill,
        temperature: payload.temperature,
        battery: payload.battery,
        latitude: payload.lat,
        longitude: payload.lng,
      },
    });
    const snapshot = await this.list();
    this.stream.emit(snapshot);
  }
}
