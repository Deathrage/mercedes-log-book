import { Autocomplete, TextField } from "@mui/material";
import React, { FC } from "react";
import { useVehiclesContext } from "./vehicles/hooks";

const VehicleSelect: FC = () => {
  const { activeVehicle, loading, vehicles, setActiveVehicle } =
    useVehiclesContext();

  const options = vehicles.map((vehicle) => ({
    label: `${vehicle.license ?? vehicle.id}${
      vehicle.model ? `, ${vehicle.model}` : ""
    }`,
    value: vehicle.id,
  }));

  return loading ? null : (
    <Autocomplete
      renderInput={(params) => <TextField {...params} />}
      getOptionLabel={(o) => o.label}
      options={options}
      value={
        options.find((o) => o.value === activeVehicle?.id) ?? {
          label: "temp",
          value: "temp",
        }
      }
      onChange={(_, option) => option && setActiveVehicle(option.value)}
      fullWidth
      componentsProps={{
        popper: {
          sx: {
            whiteSpace: "nowrap",
          },
        },
      }}
      disableClearable
    />
  );
};

export default VehicleSelect;
