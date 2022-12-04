import { z } from "zod";
import coordinates from "../src/model/schemas/coordinates";
import date from "../src/model/schemas/date";
import startEnd from "../src/model/schemas/startEnd";

const base = z.object({
  vehicleId: z.string(),
  departed: date,
  arrived: date.optional(),
  address: startEnd(z.string().optional()),
  coordinates: startEnd(coordinates.optional()),
  odometer: startEnd(z.number().optional()),
  gas: startEnd(z.number().optional()),
  battery: startEnd(z.number().optional()),
  reason: z.string().optional(),
  note: z.string().optional(),
});

const responseOrPut = base.extend({ id: z.string() });

export const GET_ONE = {
  path: (vehicleId: string, id: string) => `rides/${vehicleId}/${id}`,
  response: responseOrPut,
};

export const GET_LIST = {
  path: (vehicleId: string, pageSize: number, page: number) =>
    `rides/${vehicleId}?page=${page}&pageSize=${pageSize}`,
  response: z.object({
    hasMore: z.boolean(),
    rides: z.array(responseOrPut),
  }),
};

export const POST = {
  path: "rides",
  request: base,
  response: responseOrPut,
};

export const PUT = {
  path: POST.path,
  request: responseOrPut,
  response: responseOrPut,
};

export const DELETE = {
  path: GET_ONE.path,
  response: responseOrPut,
};
