import { Grid } from "@mui/material";
import React, { FC } from "react";
import useOnMount from "../hooks/useOnMount";
import { useVehicle } from "src/hooks/vehicle";
import { useApi } from "../api";
import {
  formatBatteryLevel,
  formatGasLevel,
  formatKilometers,
} from "../helpers/formatters";
import InfoFieldWithDate from "./InfoFieldWithDate";

const VehicleStatus: FC = () => {
  const {
    id: vehicleId,
    capacity: { gas, battery },
  } = useVehicle();

  const { data, running, invoke } = useApi((_) => _.getVehicleStatus);

  useOnMount(() => {
    invoke({ vehicleId });
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <InfoFieldWithDate
          label="Odometer"
          data={data?.odometer}
          loading={running}
          format={formatKilometers}
        />
      </Grid>
      <Grid item xs={4}>
        <InfoFieldWithDate
          label="Gas level"
          data={data?.gas?.level}
          loading={running}
          format={(val) => formatGasLevel(val, gas)}
        />
      </Grid>
      <Grid item xs={4}>
        <InfoFieldWithDate
          label="Battery level"
          data={data?.battery?.level}
          loading={running}
          format={(val) => formatBatteryLevel(val, battery)}
        />
      </Grid>
      <Grid item xs={4} />
      <Grid item xs={4}>
        <InfoFieldWithDate
          label="Gas range"
          data={data?.gas?.range}
          loading={running}
          format={formatKilometers}
        />
      </Grid>
      <Grid item xs={4}>
        <InfoFieldWithDate
          label="Battery range"
          data={data?.battery?.range}
          loading={running}
          format={formatKilometers}
        />
      </Grid>
    </Grid>
  );
};

export default VehicleStatus;
