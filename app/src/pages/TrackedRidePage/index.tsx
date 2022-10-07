import { Grid, Paper, Typography, Stack, Button } from "@mui/material";
import React from "react";
import InfoField from "../../components/InfoField";
import Rides from "../../components/Rides";
import BeginFinishButtons from "./BeginFinishButtons";
import { useRideControl } from "./hooks";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  formatCoordinates,
  formatDateTime,
  formatKilometers,
  formatBatteryLevel,
  formatGasLevel,
} from "src/helpers/formatters";
import { useVehicle } from "src/hooks/vehicle";

const TrackedRide = () => {
  const {
    capacity: { battery, gas },
  } = useVehicle();
  const { loading, current, finished, begin, finish, cancel } =
    useRideControl();

  return (
    <Grid container spacing={3} alignItems="stretch">
      <Grid item xs={4}>
        <BeginFinishButtons
          loading={loading}
          onRide={!!current}
          onBeginClick={begin}
          onFinishClick={finish}
        />
      </Grid>
      <Grid item xs={8}>
        <Paper sx={{ p: 2, height: "100%", width: "100%" }}>
          <Stack direction="row" alignItems="flex-end">
            <Typography variant="h6">Ongoing ride</Typography>
            {current && (
              <>
                <Typography variant="subtitle1" sx={{ marginLeft: "0.5rem" }}>
                  {current.id}
                </Typography>
                <Button
                  color="error"
                  sx={{ marginLeft: "auto", display: "inline-block" }}
                  onClick={cancel}
                >
                  <Stack direction="row">
                    <CancelIcon sx={{ marginRight: "0.25rem" }} /> Cancel
                  </Stack>
                </Button>
              </>
            )}
          </Stack>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <InfoField label="Departed" loading={loading}>
                {current?.departed ? formatDateTime(current.departed) : null}
              </InfoField>
            </Grid>
            <Grid item xs={8}>
              <InfoField label="Address or coordinates" loading={loading}>
                {current?.address?.start ?? current?.coordinates?.start
                  ? formatCoordinates(current.coordinates.start)
                  : null}
              </InfoField>
            </Grid>
            <Grid item xs={4}>
              <InfoField label="Odometer" loading={loading}>
                {current?.odometer?.start
                  ? formatKilometers(current.odometer.start)
                  : null}
              </InfoField>
            </Grid>
            <Grid item xs={4}>
              <InfoField label="Gas level" loading={loading}>
                {current ? formatGasLevel(current.gas.start, gas) : null}
              </InfoField>
            </Grid>
            <Grid item xs={4}>
              <InfoField label="Battery level" loading={loading}>
                {current
                  ? formatBatteryLevel(current.battery.start, battery)
                  : null}
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
              rides: finished.rides,
              onDeleted: finished.delete,
              onEdited: finished.update,
            }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TrackedRide;
