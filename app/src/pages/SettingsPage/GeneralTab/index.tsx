import { Grid, Typography } from "@mui/material";
import React, { FC } from "react";
import CurrentUser from "./CurrentUser";
import Display from "./Display";

const GeneralTab: FC = () => (
  <Grid container spacing={3}>
    <Grid item xs={6}>
      <Typography variant="h6">User</Typography>
      <CurrentUser />
    </Grid>
    <Grid item xs={6}>
      <Typography variant="h6">Display</Typography>
      <Display />
    </Grid>
  </Grid>
);

export default GeneralTab;
