import { Grid } from "@mui/material";
import React, { FC } from "react";
import useOnMount from "src/hooks/useOnMount";
import useVehicleId from "src/hooks/useVehicle";
import { useApi } from "../api";
import {
  formatDateTime,
  formatKilometers,
  formatKilowattHours,
  formatLiters,
  formatPercentage,
} from "../helpers/formatters";
import InfoField from "./InfoField";

const StatusField = <Value extends unknown>({
  label,
  data,
  loading,
  format,
}: {
  label: string;
  loading: boolean;
  data:
    | {
        value: Value;
        date: Date;
      }
    | undefined;
  format: (value: Value) => string;
}) => (
  <InfoField
    loading={loading}
    label={label}
    underline={formatDateTime(data?.date)}
  >
    {data && format(data.value)}
  </InfoField>
);

const VehicleStatus: FC = () => {
  const activeVehicleId = useVehicleId();

  const { data, running, invoke } = useApi((_) => _.getVehicleStatus);

  useOnMount(() => {
    invoke({ vin: activeVehicleId });
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <StatusField
          label="Odometer"
          data={data?.odometer}
          loading={running}
          format={formatKilometers}
        />
      </Grid>
      <Grid item xs={4}>
        <StatusField
          label="Gas level"
          data={data?.gas?.level}
          loading={running}
          format={(val) =>
            `${formatPercentage(val)} approx. ${formatLiters(
              data!.gas!.absLevel!
            )}`
          }
        />
      </Grid>
      <Grid item xs={4}>
        <StatusField
          label="Battery level"
          data={data?.battery?.level}
          loading={running}
          format={(val) =>
            `${formatPercentage(val)} approx. ${formatKilowattHours(
              data!.battery!.absLevel!
            )}`
          }
        />
      </Grid>
      <Grid item xs={4} />
      <Grid item xs={4}>
        <StatusField
          label="Gas range"
          data={data?.gas?.range}
          loading={running}
          format={formatKilometers}
        />
      </Grid>
      <Grid item xs={4}>
        <StatusField
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
