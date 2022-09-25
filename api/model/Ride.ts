import extend from "just-extend";
import entity from "../decorators/entity";
import Entity from "./Entity";
import Validatable from "./Validatable";
import RideData, { RidePointData, schema } from "../model-shared/RideData";

@entity("Rides")
export default class Ride implements Entity, Validatable, RideData {
  id: string;
  vehicleId: string;
  start: RidePointData;
  end?: RidePointData;
  note?: string;
  reason?: string;

  constructor(data?: RideData) {
    if (data) extend(this, schema.parse(data));
  }

  validate(): void {
    schema.parse(this);
  }
}
