export class BinStatus {
  code!: string;
  barangay!: string;
  fillLevel!: number;
  status!: 'online' | 'alert' | 'offline';
  latitude!: number;
  longitude!: number;
  temperature!: number;
  collectionEtaMinutes!: number;
}
