import extend from "just-extend";
import entity from "../decorators/entity";
import Entity from "./Entity";
import PropulsionType from "../model-shared/PropulsionType";
import Validatable from "./Validatable";
import VehicleData, {
  schema as VehicleDataSchema,
} from "../model-shared/VehicleData";
import { z } from "zod";
import { hasCombustionEngine, hasElectricEngine } from "../helpers/propulsion";

const schema = VehicleDataSchema.extend({
  userId: z.string(),
})
  .refine(
    (data) => hasCombustionEngine(data.propulsion) && data.capacity.gas,
    "Vehicle with combustion engine has to have gas tank capacity set!"
  )
  .refine(
    (data) => hasElectricEngine(data.propulsion) && data.capacity.battery,
    "Vehicle with electric engine has to have battery capacity set!"
  )
  .refine(
    (data) =>
      data.propulsion === PropulsionType.COMBUSTION || data.capacity.battery,
    "Vehicle with combustion engine cannot have battery capacity set!"
  )
  .refine(
    (data) =>
      data.propulsion === PropulsionType.ELECTRICITY || data.capacity.gas,
    "Vehicle with electric engine cannot have gas tank capacity set!"
  );

@entity("Vehicles")
export default class Vehicle implements Entity, Validatable, VehicleData {
  id: string;
  license?: string;
  model?: string;
  propulsion: PropulsionType;
  capacity: {
    gas?: number;
    battery?: number;
  };
  userId: string;

  constructor(data?: VehicleData) {
    if (data) extend(this, schema.parse(data));
  }

  validate(): void {
    schema.parse(this);
  }
}
