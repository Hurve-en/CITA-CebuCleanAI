import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { BinStatus } from './dto/bin-status.dto';

@Injectable()
export class BinsStream {
  private subject = new Subject<BinStatus[]>();

  emit(payload: BinStatus[]) {
    this.subject.next(payload);
  }

  asObservable() {
    return this.subject.asObservable();
  }
}
