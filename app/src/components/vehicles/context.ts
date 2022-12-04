import { createContext } from "react";
import { VehiclesContext } from "./types";

export default createContext<VehiclesContext>(
  new Proxy<VehiclesContext>({} as VehiclesContext, {
    get: () => {
      throw new Error("Vehicles context was not initialized!");
    },
  })
);
