export enum PointParametersType {
  START = "START",
  END = "END",
}

export interface RideFormValues {
  departed: Date;
  arrived: Date;
  startAddress: string;
  startLatitude: number;
  startLongitude: number;
  endAddress: string;
  endLatitude: number;
  endLongitude: number;
  startOdometer: number;
  endOdometer: number;
  startGas: number;
  endGas: number;
  startBattery: number;
  endBattery: number;
  reason: string;
  note: string;
}
