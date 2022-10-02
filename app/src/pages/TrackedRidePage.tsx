import { Grid, Button, Paper, Typography, Stack } from "@mui/material";
import React, { useCallback, useState } from "react";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import InfoField from "../components/InfoField";
import { useApi } from "../api";
import RideData from "../../../api/model-shared/RideData";
import useOnMount from "../hooks/useOnMount";
import { useVehicleId } from "../hooks/vehicle";
import useGeolocation from "../hooks/useGeolocation";
import { useErrorsContext } from "../components/errors/hooks";
import Rides from "../components/Rides";
import Coordinates from "../../../api/model-shared/Coordinates";

const TrackedRide = () => {
  const { show: showError } = useErrorsContext();

  const vehicleId = useVehicleId();

  const { current: currentLocation } = useGeolocation();

  const [currentRide, setCurrentRide] = useState<RideData>();
  const [ridesInSession, setRidesInSession] = useState<RideData[]>([]);

  const { running: loadingInitialRide, invoke: getInitialRide } = useApi(
    (_) => _.getVehicleRide
  );
  useOnMount(() => {
    getInitialRide({ vehicleId }).then((maybeRide) => {
      if (maybeRide) setCurrentRide(maybeRide);
    });
  });

  const postRequest = useCallback(
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
    (_) => _.postVehicleRideBegin
  );
  const begin = useCallback(async () => {
    const currentRide = await postRequest(postBeginRide);
    setCurrentRide(currentRide);
  }, [postBeginRide, postRequest]);

  const { running: loadingFinishRide, invoke: postFinishRide } = useApi(
    (_) => _.postVehicleRideFinish
  );
  const finish = useCallback(async () => {
    const finishedRide = await postRequest(postFinishRide);
    setCurrentRide(undefined);
    setRidesInSession((prev) => [finishedRide, ...prev]);
  }, [postFinishRide, postRequest]);

  const loading = loadingInitialRide || loadingBeginRide || loadingFinishRide;

  return (
    <Grid container spacing={3} alignItems="stretch">
      <Grid item xs={4}>
        <Paper sx={{ p: 2, width: "100%", height: "100%" }}>
          <Button
            sx={{
              width: "50%",
              aspectRatio: "1/1",
              borderWidth: "clamp(0.125rem, 1vw, 0.75rem)",
            }}
            disabled={!!currentRide || loading}
            variant="outlined"
            color="success"
            onClick={begin}
          >
            <PlayArrowOutlinedIcon
              sx={{ fontSize: "clamp(2rem, 4vw, 5rem)" }}
            />
          </Button>
          <Button
            sx={{
              width: "50%",
              aspectRatio: "1/1",
              borderWidth: "clamp(0.125rem, 1vw, 0.75rem)",
            }}
            disabled={!currentRide || loading}
            variant="outlined"
            color="error"
            onClick={finish}
          >
            <FlagOutlinedIcon sx={{ fontSize: "clamp(2rem, 4vw, 5rem)" }} />
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={8}>
        <Paper sx={{ p: 2, height: "100%", width: "100%" }}>
          <Stack direction="row" alignItems="flex-end">
            <Typography variant="h6">Ongoing ride</Typography>
            {currentRide && (
              <Typography variant="subtitle1" sx={{ marginLeft: "0.5rem" }}>
                {currentRide.id}
              </Typography>
            )}
          </Stack>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <InfoField label="Departed" loading={loading}>
                -
              </InfoField>
            </Grid>
            <Grid item xs={4}>
              <InfoField label="Address" loading={loading}>
                -
              </InfoField>
            </Grid>
            <Grid item xs={4}>
              <InfoField label="Coordinates" loading={loading}>
                -
              </InfoField>
            </Grid>
            <Grid item xs={4}>
              <InfoField label="Odometer" loading={loading}>
                -
              </InfoField>
            </Grid>
            <Grid item xs={4}>
              <InfoField label="Gas level" loading={loading}>
                -
              </InfoField>
            </Grid>
            <Grid item xs={4}>
              <InfoField label="Battery level" loading={loading}>
                -
              </InfoField>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Recent rides</Typography>
          <Rides
            controlled={{
              rides: ridesInSession,
              onDeleted: useCallback(
                (rideId: string) =>
                  setRidesInSession((rides) =>
                    // Remove deleted ride
                    rides.filter(({ id }) => id !== rideId)
                  ),
                []
              ),
              onEdited: useCallback(
                (ride: RideData) =>
                  setRidesInSession((prev) =>
                    // Replace edited ride's object
                    prev.map((prevRide) => {
                      if (prevRide.id === ride.id) return ride;
                      return prevRide;
                    })
                  ),
                []
              ),
            }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TrackedRide;
