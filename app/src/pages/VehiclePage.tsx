import { Button, Paper } from "@mui/material";
import React, { FC } from "react";
import { turnEmptyValuesToUndefined } from "../helpers/form";
import VehicleForm from "../components/VehicleForm";
import { useVehiclesContext } from "../components/vehicles/hooks";

const VehiclePage: FC = () => {
  const { activeVehicle, updateVehicle } = useVehiclesContext();
  if (!activeVehicle) throw new Error("There is no active vehicle!");

  return (
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
  );
};

export default VehiclePage;
