import { Grid, Paper, Typography, Stack, Button } from "@mui/material";
import React from "react";
import InfoField from "../../components/InfoField";
import Rides from "../../components/Rides";
import BeginFinishButtons from "./BeginFinishButtons";
import { useRideControl } from "./hooks";
import CancelIcon from "@mui/icons-material/Cancel";

const TrackedRide = () => {
  const { loading, current, finished, begin, finish } = useRideControl();

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
                >
                  <CancelIcon /> Cancel
                </Button>
              </>
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
