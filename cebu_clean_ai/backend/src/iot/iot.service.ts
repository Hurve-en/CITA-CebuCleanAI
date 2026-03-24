import { Injectable, Logger } from '@nestjs/common';
import mqtt, { MqttClient } from 'mqtt';
import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';
import { BinsService } from '../bins/bins.service';

export class TelemetryDto {
  @IsString() binCode!: string;
  @IsNumber() fill!: number;
  @IsNumber() temperature!: number;
  @IsNumber() battery!: number;
  @IsNumber() lat!: number;
  @IsNumber() lng!: number;
  @IsString() ts!: string;
}

@Injectable()
export class IotService {
  private client?: MqttClient;
  private lastMessages: TelemetryDto[] = [];
  private readonly logger = new Logger(IotService.name);
  private readonly bufferSize = 100;

  constructor(private readonly prisma: PrismaService, private readonly bins: BinsService) {
    const broker = process.env.MQTT_URL ?? 'mqtt://localhost:1883';
    this.client = mqtt.connect(broker, { reconnectPeriod: 5000 });
    this.client.on('connect', () => {
      this.logger.log(`Connected to ${broker}`);
      this.client?.subscribe('smartbin/+/telemetry');
    });
    this.client.on('reconnect', () => this.logger.warn('Reconnecting to MQTT...'));
    this.client.on('error', (err) => this.logger.error(`MQTT error: ${err.message}`));
    this.client.on('message', (_topic, payload) => {
      try {
        const dto = plainToInstance(TelemetryDto, JSON.parse(payload.toString()));
        const errors = validateSync(dto, { whitelist: true });
        if (errors.length) {
          this.logger.warn(`Dropped invalid telemetry: ${errors[0].toString()}`);
          return;
        }
        // persist + broadcast
        void this.bins.upsertFromTelemetry({
          code: dto.binCode,
          fill: dto.fill,
          temperature: dto.temperature,
          battery: dto.battery,
          lat: dto.lat,
          lng: dto.lng,
        });
        this.lastMessages = [dto, ...this.lastMessages].slice(0, this.bufferSize);
      } catch (e) {
        this.logger.warn(`Invalid telemetry payload: ${(e as Error).message}`);
      }
    });
  }

  recent(): TelemetryDto[] {
    return this.lastMessages;
  }
}
