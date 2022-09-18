import { injectable } from "inversify";
import VehicleStatus from "../model/VehicleStatus";
import {
  findResource,
  parseBoolean,
  parseLightSwitchPosition,
  parseRooftopStatus,
  parseSunroofStatus,
  parseWindowsStatus,
} from "./helpers";
import { MercedesService } from "./MercedesService";
import { ContainerVehicleStatusService } from "./__generated__";

@injectable()
export default class VehicleStatusService extends MercedesService {
  async get(vehicleId: string): Promise<VehicleStatus> {
    const responses =
      await ContainerVehicleStatusService.getResourcesForContainerIdUsingGet(
        vehicleId
      );

    return {
      deckLidOpen: findResource(responses, "decklidstatus", parseBoolean),
      doorsOpen: {
        frontLeft: findResource(responses, "doorstatusfrontleft", parseBoolean),
        frontRight: findResource(
          responses,
          "doorstatusfrontright",
          parseBoolean
        ),
        rearLeft: findResource(responses, "doorstatusrearleft", parseBoolean),
        rearRight: findResource(responses, "doorstatusrearright", parseBoolean),
      },
      interiorLightsOn: {
        front: findResource(responses, "interiorLightsFront", parseBoolean),
        rear: findResource(responses, "interiorLightsRear", parseBoolean),
      },
      lightSwitchPosition: findResource(
        responses,
        "lightswitchposition",
        parseLightSwitchPosition
      ),
      readingLampOn: {
        left: findResource(responses, "readingLampFrontLeft", parseBoolean),
        right: findResource(responses, "readingLampFrontRight", parseBoolean),
      },
      rooftop: findResource(responses, "rooftopstatus", parseRooftopStatus),
      sunroof: findResource(responses, "sunroofstatus", parseSunroofStatus),
      windows: {
        frontLeft: findResource(
          responses,
          "windowstatusfrontleft",
          parseWindowsStatus
        ),
        frontRight: findResource(
          responses,
          "windowstatusfrontright",
          parseWindowsStatus
        ),
        rearLeft: findResource(
          responses,
          "windowstatusrearleft",
          parseWindowsStatus
        ),
        rearRight: findResource(
          responses,
          "windowstatusrearright",
          parseWindowsStatus
        ),
      },
    };
  }
}
