import { z } from "zod";
import coordinates from "../src/model/schemas/coordinates";

export const POST = {
  path: (vehicleId: string) => `vehicles/${vehicleId}/ongoing-ride`,
  request: coordinates.nullable(),
  response: z.string(),
};

export const GET = {
  path: POST.path,
  response: z.string().nullable(),
};

export const DELETE = {
  path: GET.path,
};
