import { z } from "zod";
import PropulsionType from "../src/model/PropulsionType";

const base = z.object({
  license: z.string().optional(),
  model: z.string().optional(),
  propulsion: z.nativeEnum(PropulsionType),
  capacity: z.object({
    gas: z.number().optional(),
    battery: z.number().optional(),
  }),
});

const responseOrPut = base.extend({ id: z.string() });

export const GET_ONE = {
  path: (id: string) => `vehicles/${id}`,
  response: responseOrPut,
};

export const GET_ALL = {
  path: "vehicles",
  response: z.array(responseOrPut),
};

export const POST = {
  path: GET_ALL.path,
  request: base,
  response: responseOrPut,
};

export const PUT = {
  path: GET_ALL.path,
  request: responseOrPut,
  response: responseOrPut,
};

export const DELETE = {
  path: GET_ONE.path,
};
