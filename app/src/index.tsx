import { CssBaseline } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import CurrentUserProvider from "./components/currentUser/CurrentUserProvider";
import ErrorsProvider from "./components/errors/ErrorsProvider";
import ThemeProvider from "./components/theme/ThemeProvider";
import VehiclesProvider from "./components/vehicles/VehiclesProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Router from "./Router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CssBaseline />
      <ErrorsProvider>
        <CurrentUserProvider>
          <VehiclesProvider>
            <Router />
          </VehiclesProvider>
        </CurrentUserProvider>
      </ErrorsProvider>
    </LocalizationProvider>
  </ThemeProvider>
);
