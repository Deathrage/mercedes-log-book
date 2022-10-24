import { Grid, Paper, Typography } from "@mui/material";
import React from "react";

const AddressesPage = () => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <Paper sx={{ px: 2, pt: 2 }}>
        <Typography variant="h6">Address book</Typography>
      </Paper>
    </Grid>
  </Grid>
);

export default AddressesPage;
