import React, { useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Container } from "@mui/material";
import Menu from "./components/Menu";
import { BrowserRouter, Routes as Switch, Route } from "react-router-dom";
import Routes from "./consts/Routes";
import RidesPage from "./pages/RidesPage";
import { useCurrentUserContext } from "./components/currentUser/hooks";
import ConnectToMercedesDialog from "./components/ConnectToMercedesDialog";
import AddVehicleDialog from "./components/AddVehicleDialog";
import { useVehiclesContext } from "./components/vehicles/hooks";
import AddressesPage from "./pages/AddressesPage";
import SettingsPage from "./pages/SettingsPage";

const Layout = () => {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { mercedesBenzPaired } = useCurrentUserContext();
  const { activeVehicle } = useVehiclesContext();

  return (
    <BrowserRouter>
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
        <Toolbar />
        <Container maxWidth="xl">
          {mercedesBenzPaired && activeVehicle && (
            <Switch>
              <Route path={Routes.RIDES} element={<RidesPage />} />
              <Route path={Routes.ADDRESSES} element={<AddressesPage />} />
              <Route path={Routes.SETTINGS} element={<SettingsPage />} />
            </Switch>
          )}
          <ConnectToMercedesDialog />
          <AddVehicleDialog />
        </Container>
      </Box>
    </BrowserRouter>
  );
};

export default Layout;
