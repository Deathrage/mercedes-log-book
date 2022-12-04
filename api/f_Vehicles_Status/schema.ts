import { z } from "zod";
import withDate from "../src/model/schemas/withDate";

export const GET = {
  path: (vehicleId: string) => `vehicle/${vehicleId}/status`,
  response: z.object({
    vehicleId: z.string(),
    odometer: withDate(z.number()).optional(),
    gas: z
      .object({
        range: withDate(z.number()).optional(),
        level: withDate(z.number()).optional(),
      })
      .optional(),
    battery: z
      .object({
        range: withDate(z.number()).optional(),
        level: withDate(z.number()).optional(),
      })
      .optional(),
  }),
};
