import React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
// import { mainListItems, secondaryListItems } from "./listItems";
// import Chart from "./Chart";
// import Deposits from "./Deposits";
// import Orders from "./Orders";
import Copyright from "./components/Copyright";
import Header from "./components/Header";
import { Container } from "@mui/material";
import Drawer from "./components/Drawer";
import Dashboard from "./pages/Dashboard";

const Layout = () => {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
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
          <Dashboard />
          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Box>
    </>
  );
};

export default Layout;
