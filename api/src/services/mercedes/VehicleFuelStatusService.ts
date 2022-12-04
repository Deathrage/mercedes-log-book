import { injectable } from "inversify";
import { VehicleFuelStatus } from "../../model/VehicleFuelStatus";
import { findResource, parseNumber, parsePercentNumber } from "./helpers";
import MercedesOidc from "./MercedesOidc";
import MercedesService from "./MercedesService";
import { MercedesBenzClient } from "./__generated__";

@injectable()
export default class VehicleFuelStatusService extends MercedesService<VehicleFuelStatus> {
  constructor(oidc: MercedesOidc) {
    super(oidc);
  }

  protected async execute(
    vehicleId: string,
    client: MercedesBenzClient
  ): Promise<VehicleFuelStatus | null> {
    const responses =
      await client.containerFuelStatus.getResourcesForContainerIdUsingGet1(
        vehicleId
      );

    if (!responses) return null;

    return {
      tankRange: findResource(responses, "rangeliquid", parseNumber),
      tankLevel: findResource(
        responses,
        "tanklevelpercent",
        parsePercentNumber
      ),
    };
  }
}
