import { Button, Grid, Paper, Typography } from "@mui/material";
import React, { FC } from "react";
import { turnEmptyValuesToUndefined } from "../helpers/form";
import VehicleForm from "../components/VehicleForm";
import { useVehiclesContext } from "../components/vehicles/hooks";
import VehicleStatus from "src/components/VehicleStatus";

const VehiclePage: FC = () => {
  const { activeVehicle, updateVehicle } = useVehiclesContext();
  if (!activeVehicle) throw new Error("There is no active vehicle!");

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            minHeight: 240,
          }}
        >
          <Typography variant="h6">Vehicle status</Typography>
          <VehicleStatus />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            minHeight: 240,
          }}
        >
          <Typography variant="h6">Vehicle</Typography>
          <img
            src="https://images.freeimages.com/images/large-previews/e07/car-1568850.jpg"
            alt={activeVehicle?.id ?? "vehicle"}
          />
          VIN: {activeVehicle?.id ?? "-"}
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <VehicleForm
            onSubmit={(state) => {
              state = turnEmptyValuesToUndefined(state);
              return updateVehicle({
                id: state.vin,
                license: state.license,
                model: state.model,
                propulsion: state.propulsion,
                capacity: {
                  gas: state.gasCapacity,
                  battery: state.batteryCapacity,
                },
              });
            }}
            initialValues={{
              vin: activeVehicle.id,
              license: activeVehicle.license,
              model: activeVehicle.model,
              propulsion: activeVehicle.propulsion,
              gasCapacity: activeVehicle.capacity.gas,
              batteryCapacity: activeVehicle.capacity.battery,
            }}
            wrap={(children, { submitting, pristine }) => (
              <>
                {children}
                <Button
                  autoFocus
                  sx={{ ml: "auto", display: "block", marginTop: "1rem" }}
                  type="submit"
                  variant="contained"
                  disabled={submitting || pristine}
                >
                  Save
                </Button>
              </>
            )}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default VehiclePage;
