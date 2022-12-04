import { z } from "zod";

export const GET = {
  path: "current-user",
  response: z.object({
    id: z.string(),
    mercedesBenzPaired: z.boolean(),
  }),
};
