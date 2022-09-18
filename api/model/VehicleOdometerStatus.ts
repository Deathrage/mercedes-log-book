import { Column } from "typeorm";
import Timestamped from "./Timestamped";

export default class VehicleOdometerStatus {
  @Column()
  distance: Timestamped<number>;
}
