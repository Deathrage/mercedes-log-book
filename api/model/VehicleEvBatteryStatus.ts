import Timestamped from "./Timestamped";

export default interface VehicleEvBatteryStatus {
  batteryRange: Timestamped<number>;
  batteryLevel: Timestamped<number>;
}
