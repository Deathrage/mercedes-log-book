import { Grid, Paper } from "@mui/material";
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
        asdadad
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
        asdad
        {/* <Deposits /> */}
      </Paper>
    </Grid>
    {/* Recent Orders */}
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        asda
        {/* <Orders /> */}
      </Paper>
    </Grid>
  </Grid>
);

export default Dashboard;
