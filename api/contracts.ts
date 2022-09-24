import { z } from "zod";
import PropulsionType from "./model/PropulsionType";

export namespace UserResponse {
  export const schema = z.object({
    username: z.string(),
    mercedesBenzPaired: z.boolean(),
  });
  export type Type = z.infer<typeof schema>;
}

export namespace VehicleResponse {
  export const schema = z.object({
    vin: z.string(),
    license: z.string(),
    model: z.string(),
    gasCapacity: z.number().positive().optional(),
    batteryCapacity: z.number().positive().optional(),
    propulsion: z.nativeEnum(PropulsionType),
  });
  export type Type = z.infer<typeof schema>;
}

export namespace VehiclesResponse {
  export const schema = z.object({
    vehicles: z.array(VehicleResponse.schema),
    count: z.number().positive(),
  });
  export type Type = z.infer<typeof schema>;
}

export namespace PostVehicleRequest {
  export const schema = VehicleResponse.schema;
  export type Type = VehicleResponse.Type;
}
