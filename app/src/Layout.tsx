import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import Menu from "./components/Menu";
import { Outlet } from "react-router-dom";
import { useCurrentUserContext } from "./components/currentUser/hooks";
import ConnectToMercedesDialog from "./components/ConnectToMercedesDialog";
import AddVehicleDialog from "./components/AddVehicleDialog";
import { useVehiclesContext } from "./components/vehicles/hooks";
import VehicleBar from "./components/VehicleBar";

const Layout = () => {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { mercedesBenzPaired } = useCurrentUserContext();
  const { activeVehicle } = useVehiclesContext();

  return (
    <Box sx={{ display: "flex" }}>
      <Menu open={open} onToggleDrawer={toggleDrawer} />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <VehicleBar sx={{ mb: "2rem" }} />

        <Container maxWidth={false}>
          {mercedesBenzPaired && activeVehicle && <Outlet />}
          <ConnectToMercedesDialog />
          <AddVehicleDialog />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
