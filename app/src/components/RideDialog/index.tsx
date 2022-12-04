import React, { FC, useCallback, useEffect } from "react";
import { RideDialogMode, RideDialogModeType } from "./types";
import { useInitialValues, useOnSubmit } from "./hooks";
import { useVehicleId } from "../../hooks/vehicle";
import RideForm from "../RideForm";
import Header from "./Header";
import { AppBar, Button, Dialog, IconButton, Toolbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
    <Dialog open={open} onClose={onClose} fullScreen>
      <RideForm
        leftInfoField={
          mode.type === RideDialogModeType.CREATE ? <Header /> : null
        }
        initialValues={initialValues}
        onSubmit={onSubmit}
        header={({ submitting, pristine }) => (
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton edge="start" onClick={onClose}>
                <CloseIcon />
              </IconButton>
              {getTitle(mode)}
              <Button
                autoFocus
                color="inherit"
                sx={{ ml: "auto" }}
                type="submit"
                disabled={loading || submitting || pristine}
              >
                Save
              </Button>
            </Toolbar>
          </AppBar>
        )}
      />
    </Dialog>
  );
};

export default RideDialog;
