import { Paper } from "@mui/material";
import React from "react";
import Rides from "src/components/Rides";

const RidesPage = () => (
  <Paper sx={{ px: 2, pt: 2, display: "flex", flexDirection: "column" }}>
    <Rides allowCreate />
  </Paper>
);

export default RidesPage;
