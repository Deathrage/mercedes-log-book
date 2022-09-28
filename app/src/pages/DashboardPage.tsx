import { Grid, Paper, Typography } from "@mui/material";
import React from "react";
import Rides from "../components/Rides";
import { useVehiclesContext } from "../components/vehicles/hooks";
import VehicleStatus from "../components/VehicleStatus";

const DashboardPage = () => {
  const { activeVehicle } = useVehiclesContext();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            minHeight: 240,
          }}
        >
          <Typography variant="h6">Vehicle status</Typography>
          <VehicleStatus />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            minHeight: 240,
          }}
        >
          <Typography variant="h6">Vehicle</Typography>
          <img
            src="https://images.freeimages.com/images/large-previews/e07/car-1568850.jpg"
            alt={activeVehicle?.id ?? "vehicle"}
          />
          VIN: {activeVehicle?.id ?? "-"}
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Typography variant="h6">Recent rides</Typography>
          <Rides onlyFirstPage />
        </Paper>
      </Grid>
    </Grid>
  );
};
export default DashboardPage;
