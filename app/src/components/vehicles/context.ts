import { createContext } from "react";
import VehicleData from "../../../../api/model-shared/VehicleData";

export interface VehiclesContext {
  get loading(): boolean;
  get vehicles(): VehicleData[];
  get activeVehicle(): VehicleData | null;
  setActiveVehicle(id: string): void;
  createVehicle(vehicle: VehicleData): Promise<void>;
  updateVehicle(vehicle: VehicleData): Promise<void>;
}

export default createContext<VehiclesContext>(
  new Proxy<VehiclesContext>({} as VehiclesContext, {
    get: () => {
      throw new Error("Vehicles context was not initialized!");
    },
  })
);
