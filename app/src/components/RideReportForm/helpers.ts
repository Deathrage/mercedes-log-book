import { RideReportFormValues, RideReportType } from "./types";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
  subYears,
} from "date-fns";

export const getInitialValue = (type: RideReportType): RideReportFormValues => {
  const now = new Date();

  if (type === RideReportType.CURRENT_MONTH)
    return {
      from: startOfMonth(now),
      to: endOfMonth(now),
    };

  if (type === RideReportType.PREVIOUS_MONTH) {
    const nowMinusMonth = subMonths(now, 1);

    return {
      from: startOfMonth(nowMinusMonth),
      to: endOfMonth(nowMinusMonth),
    };
  }

  if (type === RideReportType.CURRENT_YEAR)
    return {
      from: startOfYear(now),
      to: endOfYear(now),
    };

  if (type === RideReportType.PREVIOUS_YEAR) {
    const nowMinusYear = subYears(now, 1);

    return {
      from: startOfYear(nowMinusYear),
      to: endOfYear(nowMinusYear),
    };
  }

  return {};
};

export const getTitle = (type: RideReportType) => {
  switch (type) {
    case RideReportType.CURRENT_MONTH:
      return "Current month";
    case RideReportType.PREVIOUS_MONTH:
      return "Previous month";
    case RideReportType.CURRENT_YEAR:
      return "Current year";
    case RideReportType.PREVIOUS_YEAR:
      return "Previous year";
    case RideReportType.CUSTOM:
      return "Custom";
    default:
      throw new Error(`Unknown value ${type}!`);
  }
};
