import { isBefore, subMinutes } from "date-fns";
import { useCallback } from "react";

const useGeolocation = () => {
  const current = useCallback(
    () =>
      new Promise<GeolocationCoordinates>((resolve, reject) => {
        if (!navigator.geolocation) {
          const error = new Error("Geolocation API not supported!");
          reject(error);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (isBefore(pos.timestamp, subMinutes(new Date(), 5))) {
              const error = new Error("Location is older than 5 minutes");
              reject(error);
              return;
            }

            resolve(pos.coords);
          },
          (err) => {
            const error = new Error(err.message);
            reject(error);
          }
        );
      }),
    []
  );

  return { current };
};

export default useGeolocation;
