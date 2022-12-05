export enum RideReportType {
  CURRENT_MONTH = "CURRENT_MONTH",
  PREVIOUS_MONTH = "PREVIOUS_MONTH",
  CURRENT_YEAR = "CURRENT_YEAR",
  PREVIOUS_YEAR = "PREVIOUS_YEAR",
  CUSTOM = "CUSTOM",
}

export type RideReportFormValues = Partial<{
  from: Date;
  to: Date;
}>;
