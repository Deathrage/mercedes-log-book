import { z } from "zod";
import PropulsionType from "./PropulsionType";

export const schema = z
  .object({
    id: z.string(),
    license: z.string(),
    model: z.string(),
    propulsion: z.nativeEnum(PropulsionType),
    capacity: z.object({
      gas: z.number().positive().int().optional(),
      battery: z.number().positive().optional(),
    }),
    userId: z.string(),
  })
  .refine(
    (data) =>
      [PropulsionType.COMBUSTION, PropulsionType.PLUGIN_HYBRID].includes(
        data.propulsion
      ) && data.capacity.gas,
    "Vehicle with combustion engine has to have gas tank capacity set!"
  )
  .refine(
    (data) =>
      [PropulsionType.ELECTRICITY, PropulsionType.PLUGIN_HYBRID].includes(
        data.propulsion
      ) && data.capacity.battery,
    "Vehicle with electric engine has to have battery capacity set!"
  )
  .refine(
    (data) =>
      data.propulsion === PropulsionType.COMBUSTION && !data.capacity.battery,
    "Vehicle with combustion engine cannot have battery capacity set!"
  )
  .refine(
    (data) =>
      data.propulsion === PropulsionType.ELECTRICITY && !data.capacity.gas,
    "Vehicle with electric engine cannot have gas tank capacity set!"
  );
type VehicleData = z.infer<typeof schema>;

export default VehicleData;
