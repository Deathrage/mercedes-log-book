import { TabContext, TabList, TabPanel } from "@mui/lab";
import { AppBar, Box, Grid, Paper, Tab } from "@mui/material";
import React, { FC, useState } from "react";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from "@mui/icons-material/Place";
import GeneralTab from "./GeneralTab";
import VehicleTab from "./VehicleTab";
import AddressesTab from "./AddressesTab";

const Settings: FC = () => {
  const [tab, setTab] = useState("1");

  return (
    <Paper sx={{ pt: 2 }}>
      <TabContext value={tab}>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ pt: "0 !important" }}>
            <AppBar position="relative">
              <TabList
                onChange={(_, v) => setTab(v)}
                textColor="inherit"
                indicatorColor="primary"
              >
                <Tab
                  label={
                    <Box display="flex" alignItems="center">
                      <PersonIcon sx={{ mr: 1 }} />
                      General
                    </Box>
                  }
                  value="1"
                />
                <Tab
                  label={
                    <Box display="flex" alignItems="center">
                      <PlaceIcon sx={{ mr: 1 }} />
                      Addresses
                    </Box>
                  }
                  value="2"
                />
                <Tab
                  label={
                    <Box display="flex" alignItems="center">
                      <DirectionsCarIcon sx={{ mr: 1 }} />
                      Vehicle
                    </Box>
                  }
                  value="3"
                />
              </TabList>
            </AppBar>
          </Grid>
        </Grid>
        <TabPanel value="1">
          <GeneralTab />
        </TabPanel>
        <TabPanel value="2">
          <AddressesTab />
        </TabPanel>
        <TabPanel value="3">
          <VehicleTab />
        </TabPanel>
      </TabContext>
    </Paper>
  );
};

export default Settings;
