import { injectable } from "inversify";
import VehicleOdometerStatus from "../model/VehicleOdometerStatus";
import { findResource, parseNumber } from "./helpers";
import { MercedesService } from "./MercedesService";
import { ContainerPayAsYouDriveInsuranceService } from "./__generated__/services/ContainerPayAsYouDriveInsuranceService";

@injectable()
export default class VehicleOdometerStatusService extends MercedesService {
  async get(vehicleId: string): Promise<VehicleOdometerStatus> {
    const responses =
      await ContainerPayAsYouDriveInsuranceService.getResourcesForContainerIdUsingGet(
        vehicleId
      );

    return {
      distance: findResource(responses, "odo", parseNumber),
    };
  }
}
