import { HttpMethod, HttpRequest } from "@azure/functions";
import Vehicle from "../model/Vehicle";

export const assertVehicleOwner = (vehicle: Vehicle, userId: string) => {
  if (vehicle.userId !== userId)
    throw new Error(`Vehicle ${vehicle.id} does not belong to user ${userId}!`);
};

export const assertValidRequest = (
  req: HttpRequest,
  allowedMethods: HttpMethod[],
  params?: Partial<Record<HttpMethod, string[]>>
) => {
  if (!allowedMethods.includes(req.method!))
    throw new Error(`Method ${req.method} is not allowed!`);

  if (req.method === "POST" && !req.body)
    throw new Error("Body is required when method is POST!");

  const requiredParams = params?.[req.method!] ?? [];
  for (const param of requiredParams) {
    if (!Reflect.has(req.params, param))
      throw new Error(`Parameter ${param} is required!`);
  }
};
