import { Grid, Paper, Typography } from "@mui/material";
import React from "react";
import Rides from "../components/Rides";

const DashboardPage = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
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

export default DashboardPage;
