import { z } from "zod";

export default z.object({
  lat: z.number(),
  lon: z.number(),
});
