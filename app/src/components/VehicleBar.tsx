import { AppBar, IconButton, SxProps, Toolbar } from "@mui/material";
import React, { FC, useCallback, useEffect } from "react";
import { useLazyApi } from "../api";
import { useVehicleId } from "../hooks/vehicle";
import InfoFieldWithDate from "./InfoFieldWithDate";
import {
  formatBatteryLevel,
  formatGasLevel,
  formatKilometers,
} from "../helpers/formatters";
import CachedIcon from "@mui/icons-material/Cached";

const VehicleBar: FC<{ sx?: SxProps }> = ({ sx }) => {
  const vehicleId = useVehicleId(false);

  const {
    data: vehicle,
    running: vehicleLoading,
    invoke: invokeVehicle,
  } = useLazyApi((_) => _.vehicle);

  const {
    data: status,
    running: statusLoading,
    invoke: invokeStatus,
  } = useLazyApi((_) => _.vehicleStatus);

  const invokeApis = useCallback(() => {
    if (!vehicleId) return;

    invokeVehicle(vehicleId);
    invokeStatus(vehicleId);
  }, [invokeStatus, invokeVehicle, vehicleId]);

  useEffect(() => invokeApis(), [invokeApis]);

  const running = statusLoading || vehicleLoading;

  return (
    <AppBar position="static" sx={sx}>
      <Toolbar sx={{ "& > *": { flex: "1 1 100%" } }}>
        <InfoFieldWithDate
          label="Odometer"
          data={status?.odometer}
          loading={running}
          format={formatKilometers}
        />
        <InfoFieldWithDate
          label="Gas level"
          data={status?.gas?.level}
          loading={running}
          format={(val) => formatGasLevel(val, vehicle!.capacity.gas)}
        />
        <InfoFieldWithDate
          label="Battery level"
          data={status?.battery?.level}
          loading={running}
          format={(val) => formatBatteryLevel(val, vehicle!.capacity.battery)}
        />
        <InfoFieldWithDate
          label="Gas range"
          data={status?.gas?.range}
          loading={running}
          format={formatKilometers}
        />
        <InfoFieldWithDate
          label="Battery range"
          data={status?.battery?.range}
          loading={running}
          format={formatKilometers}
        />
        <IconButton onClick={invokeApis} sx={{ flex: "0 0 auto" }}>
          <CachedIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default VehicleBar;
