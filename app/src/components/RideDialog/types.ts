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
      templateId: string;
    }
  | {
      type: RideDialogModeType.RETURN;
      returnFromId: string;
    }
  | {
      type: RideDialogModeType.EDIT;
      id: string;
    };
