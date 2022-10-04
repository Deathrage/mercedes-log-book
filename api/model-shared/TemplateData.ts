import { z } from "zod";
import { schema as ride } from "./RideData";

export const schema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  userId: z.string(),
  ride: ride.omit({ id: true, vehicleId: true }).partial({
    departed: true,
  }),
});

type TemplateData = z.infer<typeof schema>;

export default TemplateData;
