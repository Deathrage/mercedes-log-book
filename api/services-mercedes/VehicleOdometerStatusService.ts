import { injectable } from "inversify";
import VehicleOdometerStatus from "../model/VehicleOdometerStatus";
import { findResource, parseNumber } from "./helpers";
import MercedesOidc from "./MercedesOidc";
import MercedesService from "./MercedesService";
import { MercedesBenzClient } from "./__generated__";

@injectable()
export default class VehicleOdometerStatusService extends MercedesService<VehicleOdometerStatus> {
  constructor(oidc: MercedesOidc) {
    super(oidc);
  }

  protected async execute(
    vehicleId: string,
    client: MercedesBenzClient
  ): Promise<VehicleOdometerStatus | null> {
    const responses =
      await client.containerPayAsYouDriveInsurance.getResourcesForContainerIdUsingGet2(
        vehicleId
      );

    if (!responses) return null;

    return {
      distance: findResource(responses, "odo", parseNumber),
    };
  }
}
