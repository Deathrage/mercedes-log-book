import React, { FC, useCallback, useEffect } from "react";
import { RideDialogMode, RideDialogModeType } from "./types";
import { useInitialValues, useOnSubmit } from "./hooks";
import { useVehicleId } from "../../hooks/vehicle";
import RideForm from "../RideForm";

const getTitle = (mode: RideDialogMode) => {
  if (mode.type === RideDialogModeType.EDIT) return `Editing a ride ${mode.id}`;
  if (mode.type === RideDialogModeType.RETURN)
    return `Creating a return ride from ${mode.returnFromId}`;
  if (mode.type === RideDialogModeType.CREATE)
    return `Creating a ride${
      mode.templateId ? ` based on ${mode.templateId}` : ""
    }`;
  return "Closed";
};

const RideDialog: FC<{
  mode: RideDialogMode;
  onSaved: () => void;
  onClose: () => void;
}> = ({ mode, onClose, onSaved }) => {
  const vehicleId = useVehicleId();

  const { initialValues, loading, load, reset } = useInitialValues(mode);
  const onSubmit = useOnSubmit(
    mode,
    useCallback(() => {
      onSaved();
      reset();
    }, [onSaved, reset])
  );

  const open = mode.type !== RideDialogModeType.CLOSED;
  const rideToLoadId =
    mode.type === RideDialogModeType.EDIT
      ? mode.id
      : mode.type === RideDialogModeType.RETURN
      ? mode.returnFromId
      : mode.type === RideDialogModeType.CREATE
      ? mode.templateId
      : undefined;

  useEffect(() => {
    if (open && rideToLoadId) {
      load({ id: rideToLoadId, vehicleId });
    }
  }, [load, open, rideToLoadId, vehicleId]);

  return (
    <RideForm
      open={open}
      title={getTitle(mode)}
      loading={loading}
      initialValues={initialValues}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};

export default RideDialog;
