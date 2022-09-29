import { z } from "zod";
import { schema as ride } from "./RideData";

export const schema = z.object({
  rides: z.array(ride),
  hasMore: z.boolean(),
});

type RidesData = z.infer<typeof schema>;

export default RidesData;
