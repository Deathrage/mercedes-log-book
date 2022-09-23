import extend from "just-extend";
import { z } from "zod";
import entity from "../decorators/entity";
import Entity from "./Entity";
import PropulsionType from "./PropulsionType";
import Validatable from "./Validatable";

export const schema = z.object({
  id: z.string(),
  license: z.string(),
  model: z.string(),
  propulsion: z.nativeEnum(PropulsionType),
  userId: z.string(),
});

@entity("Vehicles")
export default class Vehicle
  implements Entity, Validatable, z.infer<typeof schema>
{
  id: string;
  license: string;
  model: string;
  propulsion: PropulsionType;
  userId: string;

  constructor(data?: z.infer<typeof schema>) {
    if (!data) extend(this, schema.parse(data));
  }

  validate(): void {
    schema.parse(this);
  }
}
