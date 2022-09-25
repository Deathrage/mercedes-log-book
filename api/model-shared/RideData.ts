import { z } from "zod";
import { schema as date } from "../model-shared/Date";

export const pointSchema = z.object({
  odometer: z.number().positive().optional(),
  date,
  gas: z.number().positive().optional(),
  battery: z.number().positive().optional(),
  address: z.string().optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lon: z.number(),
    })
    .optional(),
});

export const schema = z.object({
  id: z.string(),
  reason: z.string().optional(),
  note: z.string().optional(),
  vehicleId: z.string(),
  start: pointSchema,
  end: pointSchema.optional(),
});

type RideData = z.infer<typeof schema>;

export type RidePointData = z.infer<typeof pointSchema>;

export default RideData;
