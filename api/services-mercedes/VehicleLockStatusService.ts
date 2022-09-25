import { injectable } from "inversify";
import VehicleLockStatus from "../model/VehicleLockStatus";
import {
  findResource,
  parseBoolean,
  parseDoorLockStatus,
  parseNumber,
} from "./helpers";
import MercedesOidc from "./MercedesOidc";
import MercedesService from "./MercedesService";
import { MercedesBenzClient } from "./__generated__";

@injectable()
export default class VehicleLockStatusService extends MercedesService<VehicleLockStatus> {
  constructor(oidc: MercedesOidc) {
    super(oidc);
  }

  async execute(
    vehicleId: string,
    client: MercedesBenzClient
  ): Promise<VehicleLockStatus | null> {
    const responses =
      await client.containerVehicleLockStatus.getResourcesForContainerIdUsingGet3(
        vehicleId
      );

    if (!responses) return null;

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
