import { useCallback, useState } from "react";
import { useVehicleId } from "../../hooks/vehicle";
import RideData from "../../../../api/model-shared/RideData";
import useGeolocation from "../../hooks/useGeolocation";
import Coordinates from "../../../../api/model-shared/Coordinates";
import { useErrorsContext } from "../../components/errors/hooks";
import { useApi } from "../../api";
import useOnMount from "../../hooks/useOnMount";

export const useRideControl = () => {
  const vehicleId = useVehicleId();
  const { current: currentLocation } = useGeolocation();
  const { show: showError } = useErrorsContext();

  // Ride that is currently happening
  const [currentRide, setCurrentRide] = useState<RideData>();
  // All rides that have already been completed in this session
  // Makes table below buttons
  const [finishedRides, setFinishedRides] = useState<RideData[]>([]);

  // Fetches initial ride during mount of the page
  // If ride is already ongoing it has to be finished first before beginning new one
  const { running: loadingInitialRide, invoke: getInitialRide } = useApi(
    (_) => _.getVehicleRide,
    { defaultRunning: true }
  );
  useOnMount(() => {
    getInitialRide({ vehicleId }).then((maybeRide) => {
      if (maybeRide) setCurrentRide(maybeRide);
    });
  });

  const postWithCoordinates = useCallback(
    async (
      func: (req: { vehicleId: string; body: Coordinates }) => Promise<RideData>
    ) => {
      try {
        const { latitude, longitude } = await currentLocation();
        const ride = await func({
          vehicleId,
          body: { lat: latitude, lon: longitude },
        });
        return ride;
      } catch (err) {
        showError(err);
        throw err;
      }
    },
    [currentLocation, showError, vehicleId]
  );

  const { running: loadingBeginRide, invoke: postBeginRide } = useApi(
    (_) => _.postVehicleRideBegin,
    { silent: true }
  );
  const { running: loadingFinishRide, invoke: postFinishRide } = useApi(
    (_) => _.postVehicleRideFinish,
    { silent: true }
  );
  const { running: loadingCancelRide, invoke: postCancelRide } = useApi(
    (_) => _.postVehicleRideCancel
  );

  return {
    begin: useCallback(async () => {
      const currentRide = await postWithCoordinates(postBeginRide);
      setCurrentRide(currentRide);
    }, [postBeginRide, postWithCoordinates]),
    finish: useCallback(async () => {
      const finishedRide = await postWithCoordinates(postFinishRide);
      setCurrentRide(undefined);
      setFinishedRides((prev) => [finishedRide, ...prev]);
    }, [postFinishRide, postWithCoordinates]),
    cancel: useCallback(async () => {
      await postCancelRide({ vehicleId });
      setCurrentRide(undefined);
    }, [postCancelRide, vehicleId]),
    current: currentRide,
    finished: {
      rides: finishedRides,
      delete: useCallback(
        (rideId: string) =>
          setFinishedRides((rides) =>
            // Remove deleted ride
            rides.filter(({ id }) => id !== rideId)
          ),
        []
      ),
      update: useCallback(
        (ride: RideData) =>
          setFinishedRides((prev) =>
            // Replace edited ride's object
            prev.map((prevRide) => {
              if (prevRide.id === ride.id) return ride;
              return prevRide;
            })
          ),
        []
      ),
    },
    loading:
      loadingInitialRide ||
      loadingBeginRide ||
      loadingFinishRide ||
      loadingCancelRide,
  };
};
