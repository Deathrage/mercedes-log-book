import { z } from "zod";
import { entity, id, property } from "../../orm/decorators";
import { validateAllProperties } from "../../orm/validations";
import Entity from "../interfaces/Entity";

@entity("Templates")
export default class Template implements Entity {
  @id()
  declare id: string;

  @property(z.string())
  declare name: string;

  @property(z.string().optional())
  declare description?: string;

  @property(z.string())
  declare userId: string;

  // ride: Omit<RideData, "id" | "vehicleId" | "departed"> & { departed?: Date };

  validate(): void {
    validateAllProperties(this);
  }
}
