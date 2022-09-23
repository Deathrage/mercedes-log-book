import { injectable } from "inversify";
import { VehicleFuelStatus } from "../model/VehicleFuelStatus";
import { findResource, parseNumber } from "./helpers";
import MercedesService from "./MercedesService";
import { MercedesBenzClient } from "./__generated__";

@injectable()
export default class VehicleFuelStatusService extends MercedesService<VehicleFuelStatus> {
  async execute(
    vehicleId: string,
    client: MercedesBenzClient
  ): Promise<VehicleFuelStatus> {
    const responses =
      await client.containerFuelStatus.getResourcesForContainerIdUsingGet1(
        vehicleId
      );

    return {
      tankRange: findResource(responses, "rangeliquid", parseNumber),
      tankLevel: findResource(responses, "tanklevelpercent", parseNumber),
    };
  }
}
