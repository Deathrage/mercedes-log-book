import { entity, id, property } from "../../orm/decorators";
import Entity from "../interfaces/Entity";
import { validateAllProperties } from "../../orm/validations";
import { z } from "zod";
import {
  hasCombustionEngine,
  hasElectricEngine,
} from "../../helpers/propulsion";
import Validatable from "../interfaces/Validatable";
import PropulsionType from "../PropulsionType";

@entity("Vehicles")
export default class Vehicle implements Entity, Validatable {
  @id()
  declare id: string;

  @property(z.string().optional())
  declare license?: string;

  @property(z.string().optional())
  declare model?: string;

  @property(z.nativeEnum(PropulsionType))
  declare propulsion: PropulsionType;

  @property(
    z.object({
      gas: z.number().positive().int().optional(),
      battery: z.number().positive().step(0.1).optional(),
    })
  )
  declare capacity: {
    gas?: number;
    battery?: number;
  };

  @property(z.string())
  declare userId: string;

  @property(z.string().optional())
  declare onRideId?: string;

  validate(): void {
    validateAllProperties(this);

    if (hasCombustionEngine(this.propulsion) && !this.capacity.gas)
      throw new Error(
        "Vehicle with combustion engine has to have gas tank capacity set!"
      );

    if (hasElectricEngine(this.propulsion) && !this.capacity.battery)
      throw new Error(
        "Vehicle with electric engine has to have battery capacity set!"
      );

    if (this.propulsion === PropulsionType.COMBUSTION && this.capacity.battery)
      throw new Error(
        "Vehicle with combustion engine cannot have battery capacity set!"
      );

    if (this.propulsion === PropulsionType.ELECTRICITY && this.capacity.gas)
      throw new Error(
        "Vehicle with electric engine cannot have gas tank capacity set!"
      );
  }
}
