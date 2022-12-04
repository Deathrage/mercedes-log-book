import endpoints from "../../api/endpoints";
import { RideFormValues } from "./types";

type CreatePayload = Parameters<typeof endpoints.createRide>[0];
type UpdatePayload = Parameters<typeof endpoints.updateRide>[0];

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
