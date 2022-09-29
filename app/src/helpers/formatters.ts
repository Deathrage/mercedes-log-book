import moment from "moment";
import { isNumber } from "../../../api/helpers-shared/predicate";
import formatcoords from "formatcoords";

export const formatDate = (date: Date | string | number | undefined | null) =>
  date ? moment(date).format("DD. MM. yyyy") : undefined;

export const formatDateTime = (
  date: Date | string | number | undefined | null
) => (date ? moment(date).format("DD. MM. yyyy HH:mm:ss") : undefined);

const percentageInt = new Intl.NumberFormat("en-US", {
  style: "percent",
});
export const formatPercentage = (value: number | undefined | null) =>
  isNumber(value) ? percentageInt.format(value) : undefined;

const kmInt = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "kilometer",
});
export const formatKilometers = (value: number | undefined | null) =>
  isNumber(value) ? kmInt.format(value) : undefined;

const literInt = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "liter",
});
export const formatLiters = (value: number | undefined | null) =>
  isNumber(value) ? literInt.format(value) : undefined;

const kilowattHoursIntl = new Intl.NumberFormat("en-US", {
  style: "decimal",
});
export const formatKilowattHours = (value: number | undefined | null) =>
  isNumber(value) ? `${kilowattHoursIntl.format(value)} kWh` : undefined;

export const formatCoordinates = (
  value: { lat: number; lon: number } | undefined | null
) => (value ? formatcoords(value.lat, value.lon).format() : undefined);
