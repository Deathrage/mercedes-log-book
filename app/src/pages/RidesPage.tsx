import { Paper } from "@mui/material";
import React from "react";
import RidesSummaryPanel from "../components/RidesSummaryPanel";
import Rides from "../components/Rides";

const RidesPage = () => (
  <>
    <Paper sx={{ p: 2, mb: "1.5rem" }}>
      <RidesSummaryPanel />
    </Paper>
    <Paper sx={{ px: 2, pt: 2 }}>
      <Rides />
    </Paper>
  </>
);

export default RidesPage;
