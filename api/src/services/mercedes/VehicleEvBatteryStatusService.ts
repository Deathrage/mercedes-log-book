import { injectable } from "inversify";
import VehicleEvBatteryStatus from "../../model/VehicleEvBatteryStatus";
import { findResource, parseNumber, parsePercentNumber } from "./helpers";
import MercedesOidc from "./MercedesOidc";
import MercedesService from "./MercedesService";
import { MercedesBenzClient } from "./__generated__";

@injectable()
export default class VehicleEvBatteryStatusService extends MercedesService<VehicleEvBatteryStatus> {
  constructor(oidc: MercedesOidc) {
    super(oidc);
  }

  protected async execute(
    vehicleId: string,
    client: MercedesBenzClient
  ): Promise<VehicleEvBatteryStatus | null> {
    const responses =
      await client.containerElectricVehicleStatus.getResourcesForContainerIdUsingGet(
        vehicleId
      );

    if (!responses) return null;

    return {
      batteryRange: findResource(responses, "rangeelectric", parseNumber),
      batteryLevel: findResource(responses, "soc", parsePercentNumber),
    };
  }
}
