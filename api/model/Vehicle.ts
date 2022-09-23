import entity from "../decorators/entity";
import Entity from "./Entity";
import PropulsionType from "./PropulsionType";

@entity("Vehicles")
export default class Vehicle implements Entity {
  id: string;
  license: string;
  model: string;
  propulsion: PropulsionType;

  constructor(entity?: Partial<Vehicle>) {
    if (entity) Object.assign(this, entity);
  }
}
