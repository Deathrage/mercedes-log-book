import endpoints from "../../api/endpoints";
import { RideFormValues } from "../RideForm/types";

type GetPayload = Awaited<ReturnType<typeof endpoints.ride>>;

export const mapToValues = (data: GetPayload): RideFormValues => ({
  departed: data.departed,
  arrived: data.arrived,
  startAddress: data.address.start,
  endAddress: data.address.end,
  startLatitude: data.coordinates.start?.lat,
  startLongitude: data.coordinates.start?.lon,
  endLatitude: data.coordinates.end?.lat,
  endLongitude: data.coordinates.end?.lon,
  startOdometer: data.odometer.start,
  endOdometer: data.odometer.end,
  startGas: data.gas.start,
  endGas: data.gas.end,
  startBattery: data.battery.start,
  endBattery: data.battery.end,
  reason: data.reason,
  note: data.note,
});

export const mapToReturnValues = (data: GetPayload): RideFormValues => ({
  departed: data.arrived,
  startAddress: data.address.end,
  endAddress: data.address.start,
  startLatitude: data.coordinates.end?.lat,
  startLongitude: data.coordinates.end?.lon,
  startOdometer: data.odometer.end,
  startGas: data.gas.end,
  startBattery: data.battery.end,
});
