import { z } from "zod";
import withDate from "./withDate";

export const schema = z.object({
  rides: z.number().int(),
  odometer: withDate(z.number().int().nonnegative()).optional(),
});

type RidesSummaryData = z.infer<typeof schema>;

export default RidesSummaryData;
