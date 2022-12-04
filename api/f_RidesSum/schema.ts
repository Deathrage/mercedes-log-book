import { z } from "zod";

export const GET = {
  path: (vehicleId: string) => `rides-sum/${vehicleId}`,
  response: z.number(),
};
