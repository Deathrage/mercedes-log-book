import { z } from "zod";
import PropulsionType from "./PropulsionType";

export const schema = z.object({
  id: z.string(),
  license: z.string().optional(),
  model: z.string().optional(),
  propulsion: z.nativeEnum(PropulsionType),
  capacity: z.object({
    gas: z.number().positive().int().optional(),
    battery: z.number().positive().step(0.1).optional(),
  }),
});

type VehicleData = z.infer<typeof schema>;

export default VehicleData;
