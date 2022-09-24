import React, { useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Copyright from "./components/Copyright";
import Header from "./components/Header";
import { Container } from "@mui/material";
import Drawer from "./components/Drawer";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Routes as Switch, Route } from "react-router-dom";
import Routes from "./consts/Routes";
import Rides from "./pages/Rides";
import Vehicle from "./pages/Vehicle";

const Layout = () => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

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
          <Switch>
            <Route path={Routes.VEHICLE} element={<Vehicle />} />
            <Route path={Routes.RIDES} element={<Rides />} />
            <Route path={Routes.DASHBOARD} element={<Dashboard />} />
          </Switch>
          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Box>
    </BrowserRouter>
  );
};

export default Layout;
