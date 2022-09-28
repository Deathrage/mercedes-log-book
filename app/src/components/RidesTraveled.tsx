import { Grid } from "@mui/material";
import React, { FC } from "react";
import { useApi } from "src/api";
import { formatKilometers, formatPercentage } from "src/helpers/formatters";
import useOnMount from "src/hooks/useOnMount";
import { useVehicleId } from "src/hooks/vehicle";
import InfoField from "./InfoField";
import InfoFieldWithDate from "./InfoFieldWithDate";

const RidesTraveled: FC = () => {
  const vehicleId = useVehicleId();

  const { data, running, invoke } = useApi((_) => _.getRidesTraveled);
  useOnMount(() => {
    invoke({ vehicleId });
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <InfoField label="rides" loading={running}>
          {data && formatKilometers(data.rides)}
        </InfoField>
      </Grid>
      <Grid item xs={4}>
        <InfoFieldWithDate
          label="Odometer"
          data={data?.odometer}
          loading={running}
          format={formatKilometers}
        />
      </Grid>
      <Grid item xs={4}>
        <InfoField label="Ratio">
          {data?.rides &&
            data.odometer?.value &&
            formatPercentage(data.rides / data.odometer.value)}
        </InfoField>
      </Grid>
    </Grid>
  );
};

export default RidesTraveled;
