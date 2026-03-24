/*
  Lightweight CLI to simulate smart-bin telemetry over MQTT.
  Run: npm run simulate:iot (requires local Mosquitto or AWS IoT Core credentials)
*/
import mqtt from 'mqtt';

const broker = process.env.MQTT_URL ?? 'mqtt://localhost:1883';
const client = mqtt.connect(broker, { reconnectPeriod: 5000 });

const bins = ['CB-101', 'CB-204', 'CB-305'];

client.on('connect', () => {
  // eslint-disable-next-line no-console
  console.log(`Simulator connected to ${broker}`);
  setInterval(() => {
    const bin = bins[Math.floor(Math.random() * bins.length)];
    const payload = {
      binCode: bin,
      fill: Math.min(100, Math.random() * 100),
      temperature: 30 + Math.random() * 8,
      battery: 50 + Math.random() * 50,
      lat: 10.29 + Math.random() * 0.06,
      lng: 123.89 + Math.random() * 0.04,
      ts: new Date().toISOString(),
    };
    client.publish(`smartbin/${bin}/telemetry`, JSON.stringify(payload));
  }, 3000);
});

client.on('reconnect', () => console.log('MQTT reconnecting...'));
client.on('error', (err) => console.error('MQTT error', err.message));
