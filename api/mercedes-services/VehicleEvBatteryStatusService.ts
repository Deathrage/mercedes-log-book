import { injectable } from "inversify";
import VehicleEvBatteryStatus from "../model/VehicleEvBatteryStatus";
import { findResource, parseNumber } from "./helpers";
import { MercedesService } from "./MercedesService";
import { ContainerElectricVehicleStatusService } from "./__generated__/services/ContainerElectricVehicleStatusService";

@injectable()
export default class VehicleEvBatteryStatusService extends MercedesService {
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
