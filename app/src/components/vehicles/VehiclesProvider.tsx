import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLazyApi } from "../../api";
import useOnMount from "../../hooks/useOnMount";
import context from "./context";
import { Vehicle, VehiclesContext } from "./types";

const Provider = context.Provider;

const VehiclesProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const {
    data: apiVehicles,
    running: loading,
    invoke: invokeVehicles,
  } = useLazyApi((_) => _.currentUserVehicles, { defaultRunning: true });
  useOnMount(() => void invokeVehicles(undefined));

  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(null);

  useEffect(() => {
    if (!Array.isArray(apiVehicles)) return;
    // If there is already active vehicle
    if (activeVehicleId) {
      // Check if it is still available otherwise unset it
      if (!apiVehicles.some((v) => v.id === activeVehicleId))
        setActiveVehicleId(null);
      // Return as otherwise first vehicle will be set
      return;
    }
    // If there is no active vehicle and we have any vehicles set first
    if (apiVehicles.length === 0) return;
    setActiveVehicleId(apiVehicles[0].id);
  }, [activeVehicleId, apiVehicles]);

  const vehicles = useMemo<Vehicle[]>(() => {
    if (!Array.isArray(apiVehicles)) return [];
    return apiVehicles.map((v) => ({
      id: v.id,
      license: v.license,
      model: v.model,
    }));
  }, [apiVehicles]);

  const activeVehicle = useMemo<Vehicle | null>(() => {
    const vehicle = vehicles.find((v) => v.id === activeVehicleId);
    return vehicle ?? null;
  }, [activeVehicleId, vehicles]);

  const reload = useCallback(async () => {
    await invokeVehicles(undefined);
  }, [invokeVehicles]);

  const ctx = useMemo<VehiclesContext>(
    () => ({
      loading,
      vehicles,
      activeVehicle: activeVehicle,
      setActiveVehicle: setActiveVehicleId,
      reload,
    }),
    [loading, vehicles, activeVehicle, reload]
  );

  return <Provider value={ctx}>{children}</Provider>;
};

export default VehiclesProvider;
