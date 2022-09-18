import { injectable } from "inversify";
import { VehicleFuelStatus } from "../model/VehicleFuelStatus";
import { findResource, parseNumber } from "./helpers";
import { ContainerFuelStatusService } from "./__generated__/services/ContainerFuelStatusService";

@injectable()
export default class VehicleFuelStatusService {
  async get(vehicleId: string): Promise<VehicleFuelStatus> {
    const responses =
      await ContainerFuelStatusService.getResourcesForContainerIdUsingGet(
        vehicleId
      );

    return {
      tankRange: findResource(responses, "rangeliquid", parseNumber),
      tankLevel: findResource(responses, "tanklevelpercent", parseNumber),
    };
  }
}
