import { Vehicle } from "../components/vehicles/types";
import { useVehiclesContext } from "../components/vehicles/hooks";

export function useVehicle(throwIfNotSelected?: true): Vehicle;
export function useVehicle(throwIfNotSelected: false): Vehicle | null;
export function useVehicle(throwIfNotSelected = true): Vehicle | null {
  const { activeVehicle } = useVehiclesContext();
  if (!activeVehicle && throwIfNotSelected)
    throw new Error("Vehicle is not selected!");

  return activeVehicle;
}

export function useVehicleId(throwIfNotSelected?: true): string;
export function useVehicleId(throwIfNotSelected: false): string | null;
export function useVehicleId(throwIfNotSelected = true): string | null {
  const vehicle = useVehicle(throwIfNotSelected as any);
  return vehicle?.id || null;
}
