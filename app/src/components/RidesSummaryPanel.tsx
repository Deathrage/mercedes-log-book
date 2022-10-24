import { Grid } from "@mui/material";
import React, { FC } from "react";
import { useApi } from "src/api";
import { formatKilometers, formatPercentage } from "src/helpers/formatters";
import useOnMount from "src/hooks/useOnMount";
import { useVehicleId } from "src/hooks/vehicle";
import InfoField from "./InfoField";
import InfoFieldWithDate from "./InfoFieldWithDate";

const RideSummaryPanel: FC = () => {
  const vehicleId = useVehicleId();

  const {
    data: sum,
    running: sumLoading,
    invoke: invokeSum,
  } = useApi((_) => _.getRidesSum);
  const {
    data: odometer,
    running: odometerLoading,
    invoke: invokeOdometer,
  } = useApi((_) => _.getVehicleStatusOdometer);
  useOnMount(() => {
    invokeSum({ vehicleId });
    invokeOdometer({ vehicleId });
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <InfoField label="rides" loading={sumLoading}>
          {sum && formatKilometers(sum)}
        </InfoField>
      </Grid>
      <Grid item xs={4}>
        <InfoFieldWithDate
          label="Odometer"
          data={odometer}
          loading={odometerLoading}
          format={formatKilometers}
        />
      </Grid>
      <Grid item xs={4}>
        <InfoField label="Ratio" loading={sumLoading || odometerLoading}>
          {sum && odometer && formatPercentage(sum / odometer.value)}
        </InfoField>
      </Grid>
    </Grid>
  );
};

export default RideSummaryPanel;
