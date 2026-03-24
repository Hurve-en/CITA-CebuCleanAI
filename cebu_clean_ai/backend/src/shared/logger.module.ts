import { Module } from '@nestjs/common';
import { LoggerModule as PinoModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV === 'production' ? undefined : { target: 'pino-pretty' },
        autoLogging: true,
        customProps: () => ({ service: 'smartbin-api' }),
      },
    }),
  ],
  exports: [PinoModule],
})
export class LoggerModule {}
