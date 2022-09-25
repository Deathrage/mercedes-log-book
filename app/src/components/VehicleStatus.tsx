import { Grid } from "@mui/material";
import React, { FC, useEffect } from "react";
import { useApi } from "../api";
import {
  formatDateTime,
  formatKilometers,
  formatKilowattHours,
  formatLiters,
  formatPercentage,
} from "../helpers/formaters";
import InfoField from "./InfoField";
import { useVehiclesContext } from "./vehicles/hooks";

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
  const { activeVehicle } = useVehiclesContext();
  const activeVehicleId = activeVehicle?.id;

  const { data, running, invoke } = useApi((_) => _.getVehicleStatus);

  useEffect(() => {
    if (!activeVehicleId) return;
    invoke({ vin: activeVehicleId });
  }, [activeVehicleId, invoke]);

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
              data!.gas!.absLevel
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
              data!.battery!.absLevel
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
