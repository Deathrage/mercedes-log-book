import { Grid, Paper, Typography } from "@mui/material";
import React from "react";

const Dashboard = () => (
  <Grid container spacing={3}>
    {/* Chart */}
    <Grid item xs={12} md={8} lg={9}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: 240,
        }}
      >
        <Typography variant="h6">Vehicle status</Typography>
        {/* <Chart /> */}
      </Paper>
    </Grid>
    {/* Recent Deposits */}
    <Grid item xs={12} md={4} lg={3}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: 240,
        }}
      >
        {/* <Chart /> */}
      </Paper>
    </Grid>
    {/* Recent Orders */}
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6">Recent rides</Typography>
        {/* <Orders /> */}
      </Paper>
    </Grid>
  </Grid>
);

export default Dashboard;
