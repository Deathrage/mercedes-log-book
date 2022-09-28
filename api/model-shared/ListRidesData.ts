import { z } from "zod";
import { schema as coordinates } from "./Coordinates";
import { schema as date } from "./Date";

const location = z.object({
  address: z.string().optional(),
  coordinates: coordinates.optional(),
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
      distance: z.number().optional(),
      consumption: z.object({
        gas: z.number().optional(),
        battery: z.number().optional(),
      }),
    })
  ),
  hasMore: z.boolean(),
});

type ListRidesData = z.infer<typeof schema>;

export default ListRidesData;
