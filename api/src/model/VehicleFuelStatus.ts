import Timestamped from "./interfaces/Timestamped";

export interface VehicleFuelStatus {
  tankRange?: Timestamped<number>;
  tankLevel?: Timestamped<number>;
}
