import { Button, Grid, Typography } from "@mui/material";
import React, { FC } from "react";
import VehicleStatus from "./VehicleStatus";
import { useVehiclesContext } from "../../../components/vehicles/hooks";
import VehicleForm from "../../../components/VehicleForm";
import { turnEmptyValuesToUndefined } from "../../../helpers/form";

const VehicleTab: FC = () => {
  const { activeVehicle, updateVehicle } = useVehiclesContext();
  if (!activeVehicle) throw new Error("There is no active vehicle!");

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6">Vehicle status</Typography>
      </Grid>
      <Grid item xs={9}>
        <VehicleStatus />
      </Grid>
      <Grid item xs={3}>
        <img
          src="https://images.freeimages.com/images/large-previews/e07/car-1568850.jpg"
          alt={activeVehicle?.id ?? "vehicle"}
          style={{ maxWidth: "100%" }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Vehicle settings</Typography>
      </Grid>
      <Grid item xs={12}>
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
      </Grid>
    </Grid>
  );
};

export default VehicleTab;
