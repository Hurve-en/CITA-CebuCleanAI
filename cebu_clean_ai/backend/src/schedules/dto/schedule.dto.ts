import { IsOptional, IsString } from 'class-validator';

export class ScheduleDto {
  @IsString() day!: string;
  @IsString() type!: string;
  @IsString() window!: string;
  @IsOptional()
  @IsString()
  notes?: string;
}
