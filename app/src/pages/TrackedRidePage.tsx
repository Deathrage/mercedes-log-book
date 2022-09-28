import { Grid, Button, Paper, Typography, Stack } from "@mui/material";
import React, { useCallback, useState } from "react";
import Rides from "../components/Rides";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import InfoField from "src/components/InfoField";

const TrackedRide = () => {
  const [currentRide, setCurrentRide] = useState<string>();

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
            disabled={!!currentRide}
            variant="outlined"
            color="success"
            onClick={useCallback(() => setCurrentRide("foo"), [])}
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
            disabled={!currentRide}
            variant="outlined"
            color="error"
            onClick={useCallback(() => setCurrentRide(undefined), [])}
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
                {currentRide}
              </Typography>
            )}
          </Stack>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <InfoField label="Departed">-</InfoField>
            </Grid>
            <Grid item xs={4}>
              <InfoField label="Address">-</InfoField>
            </Grid>
            <Grid item xs={4}>
              <InfoField label="Coordinates">-</InfoField>
            </Grid>
            <Grid item xs={4}>
              <InfoField label="Odometer">-</InfoField>
            </Grid>
            <Grid item xs={4}>
              <InfoField label="Gas level">-</InfoField>
            </Grid>
            <Grid item xs={4}>
              <InfoField label="Battery level">-</InfoField>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Recent rides</Typography>
          <Rides
            onlyFirstPage
            disableCreate
            disableCopy
            disableReturn
            disableDelete
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TrackedRide;
