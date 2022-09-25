import DoorLockStatus from "./DoorLockStatus";
import Timestamped from "./Timestamped";

export default interface VehicleLockStatus {
  deckLidUnlocked?: Timestamped<boolean>;
  doorLock?: Timestamped<DoorLockStatus>;
  gasTankLidUnlocked?: Timestamped<boolean>;
  vehicleOrientation?: Timestamped<number>;
}
