import { PartialType } from '@nestjs/mapped-types';
import { CreateBinDto } from './bin-create.dto';

export class UpdateBinDto extends PartialType(CreateBinDto) {}
