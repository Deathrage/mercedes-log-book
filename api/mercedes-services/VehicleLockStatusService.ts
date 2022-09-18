import { injectable } from "inversify";
import VehicleLockStatus from "../model/VehicleLockStatus";
import {
  findResource,
  parseBoolean,
  parseDoorLockStatus,
  parseNumber,
} from "./helpers";
import { MercedesService } from "./MercedesService";
import { ContainerVehicleLockStatusService } from "./__generated__/services/ContainerVehicleLockStatusService";

@injectable()
export default class VehicleLockStatusService extends MercedesService {
  async get(vehicleId: string): Promise<VehicleLockStatus> {
    const responses =
      await ContainerVehicleLockStatusService.getResourcesForContainerIdUsingGet(
        vehicleId
      );

    return {
      deckLidUnlocked: findResource(
        responses,
        "doorlockstatusdecklid",
        parseBoolean
      ),
      doorLock: findResource(
        responses,
        "doorlockstatusvehicle",
        parseDoorLockStatus
      ),
      gasTankLidUnlocked: findResource(
        responses,
        "doorlockstatusgas",
        parseBoolean
      ),
      vehicleOrientation: findResource(
        responses,
        "positionHeading",
        parseNumber
      ),
    };
  }
}
