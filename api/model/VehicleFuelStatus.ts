import Timestamped from "./Timestamped";

export interface VehicleFuelStatus {
  tankRange?: Timestamped<number>;
  tankLevel?: Timestamped<number>;
}
