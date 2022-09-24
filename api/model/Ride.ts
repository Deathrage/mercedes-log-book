import extend from "just-extend";
import { z } from "zod";
import entity from "../decorators/entity";
import Entity from "./Entity";
import Validatable from "./Validatable";

const state = z.object({
  odometer: z.number().positive(),
  date: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date
        ? new Date(arg)
        : undefined,
    z.date()
  ),
  capacity: z.object({
    gas: z.number().positive().optional(),
    batter: z.number().positive().optional(),
  }),
  location: z.object({
    address: z.string().optional(),
    gps: z
      .object({
        lat: z.number(),
        lon: z.number(),
      })
      .optional(),
  }),
});

const schema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  start: state,
  end: state.optional(),
});

@entity("Rides")
export default class Ride
  implements Entity, Validatable, z.infer<typeof schema>
{
  id: string;
  vehicleId: string;
  start: z.infer<typeof state>;
  end?: z.infer<typeof state>;

  constructor(data?: z.infer<typeof schema>) {
    if (data) extend(this, schema.parse(data));
  }

  validate(): void {
    schema.parse(this);
  }
}
