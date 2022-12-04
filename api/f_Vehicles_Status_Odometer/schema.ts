import { z } from "zod";
import withDate from "../src/model/schemas/withDate";

export const GET = {
  path: (vehicleId: string) => `vehicle/${vehicleId}/status/odometer`,
  response: withDate(z.number()).nullable(),
};
