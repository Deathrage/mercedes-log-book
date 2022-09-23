import { injectable } from "inversify";
import VehicleEvBatteryStatus from "../model/VehicleEvBatteryStatus";
import { findResource, parseNumber } from "./helpers";
import { MercedesService } from "./MercedesService";
import { MercedesBenzClient } from "./__generated__";

@injectable()
export default class VehicleEvBatteryStatusService extends MercedesService<VehicleEvBatteryStatus> {
  protected async execute(
    vehicleId: string,
    client: MercedesBenzClient
  ): Promise<VehicleEvBatteryStatus> {
    const responses =
      await client.containerElectricVehicleStatus.getResourcesForContainerIdUsingGet(
        vehicleId
      );

    return {
      batteryRange: findResource(responses, "rangeelectric", parseNumber),
      batteryLevel: findResource(responses, "soc", parseNumber),
    };
  }
}
