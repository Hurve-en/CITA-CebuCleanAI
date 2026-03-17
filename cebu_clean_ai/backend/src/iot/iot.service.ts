import { Injectable } from '@nestjs/common';
import mqtt, { MqttClient } from 'mqtt';

export type Telemetry = {
  binCode: string;
  fill: number;
  temperature: number;
  battery: number;
  lat: number;
  lng: number;
  ts: string;
};

@Injectable()
export class IotService {
  private client?: MqttClient;
  private lastMessages: Telemetry[] = [];

  constructor() {
    const broker = process.env.MQTT_URL ?? 'mqtt://localhost:1883';
    this.client = mqtt.connect(broker, { reconnectPeriod: 5000 });
    this.client.on('connect', () => {
      this.client?.subscribe('smartbin/+/telemetry');
    });
    this.client.on('message', (topic, payload) => {
      try {
        const json = JSON.parse(payload.toString()) as Telemetry;
        this.lastMessages = [json, ...this.lastMessages].slice(0, 20);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Invalid telemetry', e);
      }
    });
  }

  recent(): Telemetry[] {
    return this.lastMessages;
  }
}
