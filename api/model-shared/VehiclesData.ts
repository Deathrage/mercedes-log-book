import { z } from "zod";
import { schema as VehicleSchema } from "./VehicleData";

export const schema = z.array(VehicleSchema);

type VehiclesData = z.infer<typeof schema>;

export default VehiclesData;
