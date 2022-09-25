import { z } from "zod";

export const schema = z.object({
  lat: z.number(),
  lon: z.number(),
});

type Coordinates = z.infer<typeof schema>;

export default Coordinates;
