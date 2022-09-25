import { z } from "zod";
import withDate from "./withDate";

export const schema = z.object({
  vehicleId: z.string(),
  odometer: withDate(z.number().positive()).optional(),
  gas: z
    .object({
      range: withDate(z.number().positive()).optional(),
      level: withDate(z.number().positive()).optional(),
      absLevel: z.number().positive().int(),
    })
    .optional(),
  battery: z
    .object({
      range: withDate(z.number().positive()).optional(),
      level: withDate(z.number().positive()).optional(),
      absLevel: z.number().positive(),
    })
    .optional(),
});

type VehicleStatusData = z.infer<typeof schema>;

export default VehicleStatusData;
