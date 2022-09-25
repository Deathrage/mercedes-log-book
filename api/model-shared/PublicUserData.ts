import { z } from "zod";

export const schema = z.object({
  id: z.string(),
  mercedesBenzPaired: z.boolean(),
});

type PublicUserData = z.infer<typeof schema>;

export default PublicUserData;
