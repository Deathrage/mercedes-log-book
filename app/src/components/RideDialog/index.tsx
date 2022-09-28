import {
  AppBar,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { FC, useCallback, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  PointParametersType,
  RideDialogMode,
  RideDialogModeType,
  RideFormValues,
} from "./types";
import PointParameters from "./PointParameters";
import { useInitialValues, useOnSubmit } from "./hooks";
import { useVehicleId } from "../../hooks/vehicle";
import { Form } from "react-final-form";
import TextInputField from "../fields/TextInputField";
import validate from "./validate";

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
      <Form<RideFormValues>
        onSubmit={onSubmit}
        initialValues={initialValues}
        validate={validate}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
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
                  disabled={loading}
                >
                  Save
                </Button>
              </Toolbar>
            </AppBar>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <PointParameters type={PointParametersType.START} />
                </Grid>
                <Grid item xs={6}>
                  <PointParameters type={PointParametersType.END} />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6">Other parameters</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <TextInputField name="reason" label="Reason" />
                    </Grid>
                    <Grid item xs={8}>
                      <TextInputField name="note" label="Note" />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
          </form>
        )}
      </Form>
    </Dialog>
  );
};

export default RideDialog;
