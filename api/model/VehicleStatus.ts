import LightSwitchPosition from "./LightSwitchPosition";
import RooftopStatus from "./RooftopStatus";
import SunroofStatus from "./SunroofStatus";
import Timestamped from "./Timestamped";
import WindowsStatus from "./WindowsStatus";

export default interface VehicleStatus {
  deckLidOpen?: Timestamped<boolean>;
  doorsOpen: {
    frontLeft?: Timestamped<boolean>;
    frontRight?: Timestamped<boolean>;
    rearLeft?: Timestamped<boolean>;
    rearRight?: Timestamped<boolean>;
  };
  interiorLightsOn: {
    front?: Timestamped<boolean>;
    rear?: Timestamped<boolean>;
  };
  lightSwitchPosition?: Timestamped<LightSwitchPosition>;
  readingLampOn: {
    left?: Timestamped<boolean>;
    right?: Timestamped<boolean>;
  };
  rooftop?: Timestamped<RooftopStatus>;
  sunroof?: Timestamped<SunroofStatus>;
  windows: {
    frontLeft?: Timestamped<WindowsStatus>;
    frontRight?: Timestamped<WindowsStatus>;
    rearLeft?: Timestamped<WindowsStatus>;
    rearRight?: Timestamped<WindowsStatus>;
  };
}
