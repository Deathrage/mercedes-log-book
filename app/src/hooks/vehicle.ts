import { useVehiclesContext } from "../components/vehicles/hooks";

export const useVehicle = () => {
  const { activeVehicle } = useVehiclesContext();
  if (!activeVehicle) throw new Error("Vehicle is not selected!");

  return activeVehicle;
};

export const useVehicleId = () => {
  const vehicle = useVehicle();
  return vehicle.id;
};
