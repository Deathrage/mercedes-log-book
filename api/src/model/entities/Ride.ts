import { z } from "zod";
import { entity, id, property } from "../../orm/decorators";
import { validateAllProperties } from "../../orm/validations";
import Entity from "../interfaces/Entity";
import Validatable from "../interfaces/Validatable";
import coordinates from "../schemas/coordinates";
import dateSchema from "../schemas/date";
import startEnd from "../schemas/startEnd";

@entity("Rides")
export default class Ride implements Entity, Validatable {
  @id()
  declare id: string;

  @property(z.string())
  declare vehicleId: string;

  @property(dateSchema)
  declare departed: Date;

  @property(dateSchema.optional())
  declare arrived?: Date;

  @property(
    z.object({ start: z.string().optional(), end: z.string().optional() })
  )
  declare address: {
    start?: string;
    end?: string;
  };

  @property(startEnd(coordinates.optional()))
  declare coordinates: {
    start?: z.infer<typeof coordinates>;
    end?: z.infer<typeof coordinates>;
  };

  @property(startEnd(z.number().int().nonnegative().optional()))
  declare odometer: {
    start?: number;
    end?: number;
  };

  @property(startEnd(z.number().step(0.01).nonnegative().optional()))
  declare gas: {
    start?: number;
    end?: number;
  };

  @property(startEnd(z.number().step(0.01).nonnegative().optional()))
  declare battery: {
    start?: number;
    end?: number;
  };

  @property(z.string().optional().optional())
  declare reason?: string;

  @property(z.string().optional())
  declare note?: string;

  validate(): void {
    validateAllProperties(this);
  }
}
