import { Paper } from "@mui/material";
import React from "react";
import RidesTraveled from "../components/RidesTraveled";
import Rides from "../components/Rides";

const RidesPage = () => (
  <>
    <Paper sx={{ p: 2, mb: "1.5rem" }}>
      <RidesTraveled />
    </Paper>
    <Paper sx={{ px: 2, pt: 2 }}>
      <Rides />
    </Paper>
  </>
);

export default RidesPage;
