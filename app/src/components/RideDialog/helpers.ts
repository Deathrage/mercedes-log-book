import endpoints from "../../api/endpoints";
import { RideFormValues } from "../RideForm/types";

type CreatePayload = Parameters<typeof endpoints.createRide>[0];
type UpdatePayload = Parameters<typeof endpoints.updateRide>[0];
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

export const mapToCreatePayload = (
  vehicleId: string,
  state: RideFormValues
): CreatePayload => ({
  vehicleId,
  departed: state.departed!,
  arrived: state.arrived,
  address: {
    start: state.startAddress,
    end: state.endAddress,
  },
  coordinates: {
    start:
      state.startLatitude && state.startLongitude
        ? { lat: state.startLatitude, lon: state.startLongitude }
        : undefined,
    end:
      state.endLatitude && state.endLongitude
        ? { lat: state.endLatitude, lon: state.endLongitude }
        : undefined,
  },
  odometer: {
    start: state.startOdometer,
    end: state.endOdometer,
  },
  gas: {
    start: state.startGas,
    end: state.endGas,
  },
  battery: {
    start: state.startBattery,
    end: state.endBattery,
  },
  reason: state.reason,
  note: state.note,
});

export const mapToUpdatePayload = (
  id: string,
  vehicleId: string,
  state: RideFormValues
): UpdatePayload => ({
  id,
  ...mapToCreatePayload(vehicleId, state),
});
