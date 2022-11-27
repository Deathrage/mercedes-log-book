import { Grid, Typography } from "@mui/material";
import React, { FC } from "react";
import { useApi } from "src/api";
import { formatKilometers, formatPercentage } from "src/helpers/formatters";
import useOnMount from "src/hooks/useOnMount";
import { useVehicleId } from "src/hooks/vehicle";
import InfoField from "../../components/InfoField";
import InfoFieldWithDate from "../../components/InfoFieldWithDate";

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
    <>
      <Typography variant="h6">Summary</Typography>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <InfoField label="rides" loading={sumLoading}>
            {sum && formatKilometers(sum)}
          </InfoField>
        </Grid>
        <Grid item xs={6}>
          <InfoFieldWithDate
            label="Odometer"
            data={odometer}
            loading={odometerLoading}
            format={formatKilometers}
          />
        </Grid>
        <Grid item xs={12}>
          <InfoField label="Ratio" loading={sumLoading || odometerLoading}>
            {sum && odometer && formatPercentage(sum / odometer.value)}
          </InfoField>
        </Grid>
      </Grid>
    </>
  );
};

export default RideSummaryPanel;
