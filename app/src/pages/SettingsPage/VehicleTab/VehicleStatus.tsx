import { Grid } from "@mui/material";
import React, { FC } from "react";
import { useVehicleId } from "src/hooks/vehicle";
import { useApi } from "../../../api";
import {
  formatBatteryLevel,
  formatGasLevel,
  formatKilometers,
} from "../../../helpers/formatters";
import InfoFieldWithDate from "../../../components/InfoFieldWithDate";

const VehicleStatus: FC = () => {
  const vehicleId = useVehicleId();

  const { data: vehicle, running: vehicleLoading } = useApi((_) => _.vehicle, {
    request: vehicleId,
  });

  const { data: status, running: statusLoading } = useApi(
    (_) => _.vehicleStatus,
    {
      request: vehicleId,
    }
  );

  const running = statusLoading || vehicleLoading;

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <InfoFieldWithDate
          label="Odometer"
          data={status?.odometer}
          loading={running}
          format={formatKilometers}
        />
      </Grid>
      <Grid item xs={4}>
        <InfoFieldWithDate
          label="Gas level"
          data={status?.gas?.level}
          loading={running}
          format={(val) => formatGasLevel(val, vehicle!.capacity.gas)}
        />
      </Grid>
      <Grid item xs={4}>
        <InfoFieldWithDate
          label="Battery level"
          data={status?.battery?.level}
          loading={running}
          format={(val) => formatBatteryLevel(val, vehicle!.capacity.battery)}
        />
      </Grid>
      <Grid item xs={4} />
      <Grid item xs={4}>
        <InfoFieldWithDate
          label="Gas range"
          data={status?.gas?.range}
          loading={running}
          format={formatKilometers}
        />
      </Grid>
      <Grid item xs={4}>
        <InfoFieldWithDate
          label="Battery range"
          data={status?.battery?.range}
          loading={running}
          format={formatKilometers}
        />
      </Grid>
    </Grid>
  );
};

export default VehicleStatus;
