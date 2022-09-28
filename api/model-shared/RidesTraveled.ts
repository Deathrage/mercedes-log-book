import { z } from "zod";
import withDate from "./withDate";

export const schema = z.object({
  rides: z.number().int(),
  odometer: withDate(z.number().int().nonnegative()).optional(),
});

type RidesTraveled = z.infer<typeof schema>;

export default RidesTraveled;
