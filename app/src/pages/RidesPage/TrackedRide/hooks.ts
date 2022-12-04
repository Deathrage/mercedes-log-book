import { useCallback, useEffect, useState } from "react";
import useGeolocation from "../../../hooks/useGeolocation";
import { useErrorsContext } from "../../../components/errors/hooks";
import { useLazyApi } from "../../../api";
import useOnMount from "src/hooks/useOnMount";

const useInitialRide = (vehicleId: string) => {
  // Fetches initial ride during mount of the page
  // If ride is already ongoing it has to be finished first before beginning new one
  const {
    running: rideIdLoading,
    data: rideId,
    invoke: loadInitialRide,
  } = useLazyApi((_) => _.ongoingRide, { defaultRunning: true });
  useOnMount(() => void loadInitialRide(vehicleId));

  // Fetches initial ride during mount of the page
  // If ride is already ongoing it has to be finished first before beginning new one
  const {
    running: loadingRide,
    invoke: loadRide,
    data: ride,
  } = useLazyApi((_) => _.ride);

  useEffect(() => {
    if (rideId) loadRide({ id: rideId, vehicleId });
  }, [loadRide, rideId, vehicleId]);

  return { loading: rideIdLoading || loadingRide || (rideId && !ride), ride };
};

const useRideApi = (vehicleId: string) => {
  const { show: showError } = useErrorsContext();
  const { current: currentLocation } = useGeolocation();

  const { running: loadingRide, invoke: loadRide } = useLazyApi((_) => _.ride, {
    silent: true,
  });

  const { running: loadingStartStop, invoke: invokeStartStop } = useLazyApi(
    (_) => _.startStopOngoingRide,
    { silent: true }
  );
  const { running: loadingCancel, invoke: cancel } = useLazyApi(
    (_) => _.cancelOngoingRide
  );

  const startStop = useCallback(async () => {
    try {
      const { latitude, longitude } = await currentLocation();

      const rideId = await invokeStartStop({
        vehicleId,
        coordinates: { lat: latitude, lon: longitude },
      });
      const ride = await loadRide({ id: rideId, vehicleId });

      return ride;
    } catch (err) {
      showError(err);
      throw err;
    }
  }, [currentLocation, invokeStartStop, loadRide, showError, vehicleId]);

  return {
    loading: loadingCancel || loadingStartStop || loadingRide,
    startStop,
    cancel,
  };
};

export const useRideControl = (vehicleId: string) => {
  // Fetches initial ride during mount of the page
  // If ride is already ongoing it has to be finished first before beginning new one
  const { loading: initialRideLoading, ride: initialRide } =
    useInitialRide(vehicleId);

  // Ride that is currently happening
  const [currentRide, setCurrentRide] = useState<typeof initialRide>();
  useEffect(() => {
    if (initialRide) setCurrentRide(initialRide);
  }, [initialRide]);

  const { loading: rideApiLoading, startStop, cancel } = useRideApi(vehicleId);

  return {
    begin: useCallback(async () => {
      const currentRide = await startStop();
      setCurrentRide(currentRide);
    }, [startStop]),
    finish: useCallback(async () => {
      await startStop();
      setCurrentRide(undefined);
    }, [startStop]),
    cancel: useCallback(async () => {
      await cancel(vehicleId);
      setCurrentRide(undefined);
    }, [cancel, vehicleId]),
    current: currentRide,
    loading: initialRideLoading || rideApiLoading,
  };
};
