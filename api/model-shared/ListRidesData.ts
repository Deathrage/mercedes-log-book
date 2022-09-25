import { z } from "zod";
import { schema as coordinates } from "./Coordinates";
import { schema as date } from "./Date";

const milestone = z.object({
  address: z.string().optional(),
  coordinates: coordinates.optional(),
  date: date,
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
      started: milestone,
      ended: milestone.optional(),
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
