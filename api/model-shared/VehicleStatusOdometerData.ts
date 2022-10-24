import { z } from "zod";
import withDate from "./withDate";

export const schema = withDate(z.number().int().nonnegative()).optional();

type VehicleStatusOdometerData = z.infer<typeof schema>;

export default VehicleStatusOdometerData;
