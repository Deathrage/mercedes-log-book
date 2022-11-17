import { Grid, Paper } from "@mui/material";
import React from "react";
import RidesSummaryPanel from "./RidesSummaryPanel";
import Rides from "./Rides";
import TrackedRide from "./TrackedRide";

const RidesPage = () => (
  <Grid container spacing={3} alignItems="stretch">
    <Grid item xs={8}>
      <Paper sx={{ p: 2, height: "100%" }}>
        <TrackedRide />
      </Paper>
    </Grid>
    <Grid item xs={4}>
      <Paper sx={{ p: 2, height: "100%" }}>
        <RidesSummaryPanel />
      </Paper>
    </Grid>
    <Grid item xs={12}>
      <Paper sx={{ px: 2, pt: 2 }}>
        <Rides />
      </Paper>
    </Grid>
  </Grid>
);

export default RidesPage;
