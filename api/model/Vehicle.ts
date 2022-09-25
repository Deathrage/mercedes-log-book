import extend from "just-extend";
import entity from "../decorators/entity";
import Entity from "./Entity";
import PropulsionType from "../model-shared/PropulsionType";
import Validatable from "./Validatable";
import VehicleData, { schema } from "../model-shared/VehicleData";

@entity("Vehicles")
export default class Vehicle implements Entity, Validatable, VehicleData {
  id: string;
  license: string;
  model: string;
  propulsion: PropulsionType;
  capacity: {
    gas: number;
    battery: number;
  };
  userId: string;

  constructor(data?: VehicleData) {
    if (data) extend(this, schema.parse(data));
  }

  validate(): void {
    schema.parse(this);
  }
}
