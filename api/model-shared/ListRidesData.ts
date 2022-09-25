import { z } from "zod";
import { schema as coordinates } from "./Coordinates";
import { schema as date } from "./Date";

const location = z.object({
  address: z.string().optional(),
  coordinates: coordinates.optional(),
});

const consumptionItem = z.object({
  relative: z.number().positive().optional(),
  absolute: z.number().positive().optional(),
});

export const schema = z.object({
  rides: z.array(
    z.object({
      id: z.string(),
      reason: z.string().optional(),
      departed: date,
      startLocation: location,
      arrived: date.optional(),
      endLocation: location,
      distance: z.number().positive().optional(),
      consumption: z.object({
        gas: consumptionItem.optional(),
        battery: consumptionItem.optional(),
      }),
    })
  ),
  hasMore: z.boolean(),
});

type ListRidesData = z.infer<typeof schema>;

export default ListRidesData;
