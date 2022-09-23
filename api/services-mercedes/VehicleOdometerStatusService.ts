import { injectable } from "inversify";
import VehicleOdometerStatus from "../model/VehicleOdometerStatus";
import { findResource, parseNumber } from "./helpers";
import MercedesService from "./MercedesService";
import { MercedesBenzClient } from "./__generated__";

@injectable()
export default class VehicleOdometerStatusService extends MercedesService<VehicleOdometerStatus> {
  async execute(
    vehicleId: string,
    client: MercedesBenzClient
  ): Promise<VehicleOdometerStatus> {
    const responses =
      await client.containerPayAsYouDriveInsurance.getResourcesForContainerIdUsingGet2(
        vehicleId
      );

    return {
      distance: findResource(responses, "odo", parseNumber),
    };
  }
}
