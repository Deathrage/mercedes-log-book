import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import CurrentUserProvider from "./components/current-user/CurrentUserProvider";
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
        <CurrentUserProvider>
          <Layout />
        </CurrentUserProvider>
      </Box>
    </ThemeProvider>
  </React.StrictMode>
);
