import { Box, CssBaseline } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import CurrentUserProvider from "./components/currentUser/CurrentUserProvider";
import ErrorsProvider from "./components/errors/ErrorsProvider";
import ThemeProvider from "./components/theme/ThemeProvider";
import VehiclesProvider from "./components/vehicles/VehiclesProvider";
import Layout from "./Layout";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider>
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <ErrorsProvider>
        <CurrentUserProvider>
          <VehiclesProvider>
            <Layout />
          </VehiclesProvider>
        </CurrentUserProvider>
      </ErrorsProvider>
    </Box>
  </ThemeProvider>
);
