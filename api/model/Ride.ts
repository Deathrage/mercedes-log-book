import extend from "just-extend";
import entity from "../decorators/entity";
import Entity from "./Entity";
import Validatable from "./Validatable";
import RideData, { schema } from "../model-shared/RideData";
import Coordinates from "../model-shared/Coordinates";

@entity("Rides")
export default class Ride implements Entity, Validatable, RideData {
  id: string;
  vehicleId: string;
  departed: Date;
  arrived?: Date;
  address: {
    start?: string;
    end?: string;
  };
  coordinates: {
    start?: Coordinates;
    end?: Coordinates;
  };
  odometer: {
    start?: number;
    end?: number;
  };
  gas: {
    start?: number;
    end?: number;
  };
  battery: {
    start?: number;
    end?: number;
  };
  reason?: string;
  note?: string;

  constructor(data?: RideData) {
    if (data) extend(this, schema.parse(data));
  }

  validate(): void {
    schema.parse(this);
  }
}
