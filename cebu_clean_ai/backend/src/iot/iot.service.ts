import { Injectable, Logger } from '@nestjs/common';
import mqtt, { MqttClient } from 'mqtt';
import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

export class Telemetry {
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
  private lastMessages: Telemetry[] = [];
  private readonly logger = new Logger(IotService.name);
  private readonly bufferSize = 100;

  constructor() {
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
        const dto = plainToInstance(Telemetry, JSON.parse(payload.toString()));
        const errors = validateSync(dto, { whitelist: true });
        if (errors.length) {
          this.logger.warn(`Dropped invalid telemetry: ${errors[0].toString()}`);
          return;
        }
        this.lastMessages = [dto, ...this.lastMessages].slice(0, this.bufferSize);
      } catch (e) {
        this.logger.warn(`Invalid telemetry payload: ${(e as Error).message}`);
      }
    });
  }

  recent(): Telemetry[] {
    return this.lastMessages;
  }
}
