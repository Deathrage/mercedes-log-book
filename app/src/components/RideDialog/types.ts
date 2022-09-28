export enum RideDialogModeType {
  CREATE = "CREATE",
  EDIT = "EDIT",
  RETURN = "RETURN",
  CLOSED = "CLOSED",
}

export type RideDialogMode =
  | {
      type: RideDialogModeType.CLOSED;
    }
  | {
      type: RideDialogModeType.CREATE;
      templateId?: string;
    }
  | {
      type: RideDialogModeType.RETURN;
      returnFromId: string;
    }
  | {
      type: RideDialogModeType.EDIT;
      id: string;
    };

export enum PointParametersType {
  START = "START",
  END = "END",
}

export type RideFormValues = Partial<{
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
}>;
