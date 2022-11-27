import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import VehicleData from "../../../../api/model-shared/VehicleData";
import { useApi } from "../../api";
import useOnMount from "../../hooks/useOnMount";
import context, { VehiclesContext } from "./context";

const Provider = context.Provider;

const VehiclesProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const { data: vehicles, invoke: invokeVehicles } = useApi(
    (_) => _.getVehicles
  );
  useOnMount(() => {
    invokeVehicles(null);
  });

  const [activeVehicle, setActiveVehicle] = useState<VehicleData | null>(null);

  const activateVehicle = useCallback(
    (id: string) => {
      const vehicle = vehicles?.find((v) => v.id === id);
      if (!vehicle) throw new Error(`Unknown vehicle ${id}`);

      setActiveVehicle(vehicle);
    },
    [vehicles]
  );

  useEffect(() => {
    if (!vehicles) return;

    setLoading(false);

    const toActivate = vehicles[0];
    if (!toActivate) return;

    setActiveVehicle(toActivate);
  }, [activeVehicle, vehicles]);

  const { invoke: invokePostVehicle } = useApi((_) => _.postVehicle);

  const createVehicle = useCallback(
    async (vehicle: VehicleData) => {
      if (!vehicles) return;

      const newVehicle = await invokePostVehicle(vehicle);

      vehicles.push(newVehicle);
      setActiveVehicle(newVehicle);
    },
    [invokePostVehicle, vehicles]
  );

  const updateVehicle = useCallback(
    async (vehicleData: VehicleData) => {
      if (!vehicles) return;
      const vehicleIndex = vehicles.findIndex((v) => v.id === vehicleData.id);
      if (vehicleIndex < 0)
        throw new Error(`Unknown vehicle ${vehicleData.id}`);

      const savedVehicle = await invokePostVehicle(vehicleData);

      vehicles[vehicleIndex] = savedVehicle;
      setActiveVehicle(savedVehicle);
    },
    [invokePostVehicle, vehicles]
  );

  const ctx = useMemo<VehiclesContext>(
    () =>
      !loading
        ? {
            loading: false,
            vehicles: [],
            activeVehicle: activeVehicle,
            setActiveVehicle: activateVehicle,
            createVehicle,
            updateVehicle,
          }
        : {
            loading: true,
            vehicles: [],
            activeVehicle: null,
            setActiveVehicle: () => void 0,
            createVehicle: () => Promise.resolve(),
            updateVehicle: () => Promise.resolve(),
          },
    [loading, activeVehicle, activateVehicle, createVehicle, updateVehicle]
  );

  return <Provider value={ctx}>{children}</Provider>;
};

export default VehiclesProvider;
