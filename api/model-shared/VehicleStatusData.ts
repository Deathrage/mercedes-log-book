import { z } from "zod";
import withDate from "./withDate";

export const schema = z.object({
  vehicleId: z.string(),
  odometer: withDate(z.number().int().nonnegative()).optional(),
  gas: z
    .object({
      range: withDate(z.number().int().nonnegative()).optional(),
      level: withDate(z.number().step(0.01).nonnegative()).optional(),
    })
    .optional(),
  battery: z
    .object({
      range: withDate(z.number().int().nonnegative()).optional(),
      level: withDate(z.number().step(0.01).nonnegative()).optional(),
    })
    .optional(),
});

type VehicleStatusData = z.infer<typeof schema>;

export default VehicleStatusData;
