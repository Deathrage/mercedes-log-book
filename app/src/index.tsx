import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import CurrentUserProvider from "./components/current-user/CurrentUserProvider";
import ErrorsProvider from "./components/errors/ErrorsProvider";
import VehiclesProvider from "./components/vehicles/VehiclesProvider";
import Layout from "./Layout";

const mdTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={mdTheme}>
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
  </React.StrictMode>
);
