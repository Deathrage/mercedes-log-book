import moment from "moment";

export const formatDate = (date: Date | string | number | undefined | null) =>
  date ? moment(date).format("DD. MM. yyyy") : undefined;

export const formatDateTime = (
  date: Date | string | number | undefined | null
) => (date ? moment(date).format("DD. MM. yyyy hh:mm:ss") : undefined);

const percentageInt = new Intl.NumberFormat("en-US", {
  style: "percent",
});
export const formatPercentage = (value: number) => percentageInt.format(value);

const kmInt = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "kilometer",
});
export const formatKilometers = (value: number) => kmInt.format(value);

const literInt = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "liter",
});
export const formatLiters = (value: number) => literInt.format(value);

const kilowattHoursIntl = new Intl.NumberFormat("en-US", {
  style: "decimal",
});
export const formatKilowattHours = (value: number) =>
  `${kilowattHoursIntl.format(value)} kWh`;
