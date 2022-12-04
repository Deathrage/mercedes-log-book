import Timestamped from "./interfaces/Timestamped";

export default interface VehicleEvBatteryStatus {
  batteryRange?: Timestamped<number>;
  batteryLevel?: Timestamped<number>;
}
