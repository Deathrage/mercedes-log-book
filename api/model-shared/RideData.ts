import { z } from "zod";
import { schema as date } from "../model-shared/Date";
import { schema as coordinates } from "./Coordinates";

const difSchema = <Type extends z.ZodTypeAny>(innerType: Type) =>
  z.object({
    start: innerType.optional(),
    end: innerType.optional(),
  });

export const schema = z.object({
  id: z.string().optional(),
  vehicleId: z.string(),
  departed: date,
  arrived: date.optional(),
  address: difSchema(z.string()),
  coordinates: difSchema(coordinates),
  odometer: difSchema(z.number()),
  gas: difSchema(z.number()),
  battery: difSchema(z.number()),
  reason: z.string().optional(),
  note: z.string().optional(),
});

type RideData = z.infer<typeof schema>;

export default RideData;
