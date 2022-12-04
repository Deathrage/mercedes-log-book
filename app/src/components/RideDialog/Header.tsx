import React, { FC } from "react";
import useOnMount from "../../hooks/useOnMount";
import { useLazyApi } from "../../api";
import { useVehicleId } from "../../hooks/vehicle";
import { formatKilometers } from "../../helpers/formatters";
import InfoFieldWithDate from "../InfoFieldWithDate";

const Header: FC = () => {
  const vehicleId = useVehicleId();

  const {
    data: odometer,
    running: odometerLoading,
    invoke: invokeOdometer,
  } = useLazyApi((_) => _.vehicleOdometer);
  useOnMount(() => {
    invokeOdometer(vehicleId);
  });

  return (
    <InfoFieldWithDate
      label="Current odometer"
      data={odometer}
      loading={odometerLoading}
      format={formatKilometers}
    />
  );
};

export default Header;
