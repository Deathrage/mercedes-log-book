import VehicleEvBatteryStatus from "../model/VehicleEvBatteryStatus";
import { findResource, parseNumber } from "./helpers";
import { ContainerElectricVehicleStatusService } from "./__generated__/services/ContainerElectricVehicleStatusService";

export default class VehicleEvBatteryStatusService {
  async get(vehicleId: string): Promise<VehicleEvBatteryStatus> {
    const responses =
      await ContainerElectricVehicleStatusService.getResourcesForContainerIdUsingGet(
        vehicleId
      );

    return {
      batteryRange: findResource(responses, "rangeelectric", parseNumber),
      batteryLevel: findResource(responses, "soc", parseNumber),
    };
  }
}
