import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBinDto {
  @IsString() code!: string;
  @IsString() barangay!: string;
  @IsNumber() latitude!: number;
  @IsNumber() longitude!: number;
  @IsOptional()
  @IsNumber()
  fillLevel?: number;
  @IsOptional()
  @IsNumber()
  temperature?: number;
}
