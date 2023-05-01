import { format } from "date-fns";
import formatcoords from "formatcoords";

export const formatDate = (date: Date | number | undefined | null) =>
  date ? format(date, "dd. MM. yyyy") : undefined;

export const formatDateTime = (date: Date | number | undefined | null) =>
  date ? format(date, "dd. MM. yyyy HH:mm:ss") : undefined;

const percentageInt = new Intl.NumberFormat("en-US", {
  style: "percent",
});
export const formatPercentage = (value: number | undefined | null) =>
  typeof value === "number" ? percentageInt.format(value) : undefined;

const kmInt = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "kilometer",
});
export const formatKilometers = (value: number | undefined | null) =>
  typeof value === "number" ? kmInt.format(value) : undefined;

const literInt = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "liter",
});
export const formatLiters = (value: number | undefined | null) =>
  typeof value === "number" ? literInt.format(value) : undefined;

const kilowattHoursIntl = new Intl.NumberFormat("en-US", {
  style: "decimal",
});
export const formatKilowattHours = (value: number | undefined | null) =>
  typeof value === "number"
    ? `${kilowattHoursIntl.format(value)} kWh`
    : undefined;

export const formatCoordinates = (
  value: { lat: number; lon: number } | undefined | null
) => (value ? formatcoords(value.lat, value.lon).format() : undefined);

export const formatBatteryLevel = (
  level: number | null | undefined,
  capacity: number | null | undefined
) =>
  `${formatPercentage(level) ?? "-"} approx. ${
    typeof capacity === "number" && typeof level === "number"
      ? formatKilowattHours(capacity * level)
      : "-"
  }`;

export const formatGasLevel = (
  level: number | null | undefined,
  capacity: number | null | undefined
) =>
  `${formatPercentage(level) ?? "-"} approx. ${
    typeof capacity === "number" && typeof level === "number"
      ? formatLiters(capacity * level)
      : "-"
  }`;
