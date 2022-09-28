import { useVehiclesContext } from "../components/vehicles/hooks";

const useVehicleId = () => {
  const { activeVehicle } = useVehiclesContext();

  const vehicleId = activeVehicle?.id;
  if (!vehicleId) throw new Error("Vehicle is not selected!");

  return vehicleId;
};

export default useVehicleId;
