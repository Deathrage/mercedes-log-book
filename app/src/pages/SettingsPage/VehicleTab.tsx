import { Button, Grid, Typography } from "@mui/material";
import React, { FC } from "react";
import VehicleStatus from "../../components/VehicleStatus";
import VehicleForm from "../../components/VehicleForm";
import { turnEmptyValuesToUndefined } from "../../helpers/form";
import { useVehicleId } from "src/hooks/vehicle";
import { useLazyApi } from "src/api";
import useOnMount from "src/hooks/useOnMount";

const VehicleTab: FC = () => {
  const vehicleId = useVehicleId();

  const {
    data: vehicle,
    running: vehicleLoading,
    invoke,
  } = useLazyApi((_) => _.vehicle, {
    defaultRunning: true,
  });

  useOnMount(() => void invoke(vehicleId));

  const { invoke: update } = useLazyApi((_) => _.updateVehicle);

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
          alt={vehicleId}
          style={{ maxWidth: "100%" }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Vehicle settings</Typography>
      </Grid>
      <Grid item xs={12}>
        <VehicleForm
          loading={vehicleLoading}
          onSubmit={async (state) => {
            state = turnEmptyValuesToUndefined(state);
            await update({
              id: state.vin,
              license: state.license,
              model: state.model,
              propulsion: state.propulsion,
              capacity: {
                gas: state.gasCapacity,
                battery: state.batteryCapacity,
              },
            });
            await invoke(vehicleId);
          }}
          initialValues={
            vehicle
              ? {
                  vin: vehicle.id,
                  license: vehicle.license,
                  model: vehicle.model,
                  propulsion: vehicle.propulsion,
                  gasCapacity: vehicle.capacity.gas,
                  batteryCapacity: vehicle.capacity.battery,
                }
              : undefined
          }
          wrap={(children, { submitting, pristine }) => (
            <>
              {children}
              <Button
                autoFocus
                sx={{ ml: "auto", display: "block", marginTop: "1rem" }}
                type="submit"
                variant="contained"
                disabled={submitting || pristine || !vehicle}
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
