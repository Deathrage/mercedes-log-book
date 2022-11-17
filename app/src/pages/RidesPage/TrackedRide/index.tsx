import { Grid, Typography, Stack, Button } from "@mui/material";
import React, { FC, useCallback } from "react";
import InfoField from "../../../components/InfoField";
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

const TrackedRide: FC<{ onFinished?: () => void }> = ({ onFinished }) => {
  const {
    capacity: { battery, gas },
  } = useVehicle();
  const { loading, current, begin, finish, cancel } = useRideControl();

  return (
    <Grid container spacing={3} alignItems="stretch">
      <Grid item maxWidth="7rem">
        <BeginFinishButtons
          loading={loading}
          onRide={!!current}
          onBeginClick={begin}
          onFinishClick={useCallback(async () => {
            await finish();
            onFinished?.();
          }, [finish, onFinished])}
        />
      </Grid>
      <Grid item flexGrow={1}>
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
      </Grid>
    </Grid>
  );
};

export default TrackedRide;
