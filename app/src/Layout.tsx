import React, { useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Copyright from "./components/Copyright";
import Header from "./components/Header";
import { Container } from "@mui/material";
import Drawer from "./components/Drawer";
import TrackedRidePage from "./pages/TrackedRidePage";
import { BrowserRouter, Routes as Switch, Route } from "react-router-dom";
import Routes from "./consts/Routes";
import RidesPage from "./pages/RidesPage";
import VehiclePage from "./pages/VehiclePage";
import { useCurrentUserContext } from "./components/current-user/hooks";
import ConnectToMercedesDialog from "./components/ConnectToMercedesDialog";
import AddVehicleDialog from "./components/AddVehicleDialog";
import { useVehiclesContext } from "./components/vehicles/hooks";

const Layout = () => {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { mercedesBenzPaired } = useCurrentUserContext();
  const { activeVehicle } = useVehiclesContext();

  return (
    <BrowserRouter>
      <Header open={open} onToggleDrawer={toggleDrawer} />
      <Drawer open={open} onToggleDrawer={toggleDrawer} />
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
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {mercedesBenzPaired && activeVehicle && (
            <Switch>
              <Route path={Routes.VEHICLE} element={<VehiclePage />} />
              <Route path={Routes.RIDES} element={<RidesPage />} />
              <Route path={Routes.TRACKED_RIDE} element={<TrackedRidePage />} />
            </Switch>
          )}
          <ConnectToMercedesDialog />
          <AddVehicleDialog />
          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Box>
    </BrowserRouter>
  );
};

export default Layout;
