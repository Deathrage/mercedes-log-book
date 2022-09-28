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
import React, { FC, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { PointParametersType, RideFormValues } from "./types";
import PointParameters from "./PointParameters";
import { useInitialValues, useOnSubmit } from "./hooks";
import useVehicleId from "../../hooks/useVehicle";
import { Form } from "react-final-form";
import TextInputField from "../fields/TextInputField";

const RideDialog: FC<{
  open: boolean;
  onSaved: () => void;
  onClose: () => void;
  rideId?: string;
}> = ({ rideId, open, onClose, onSaved }) => {
  const vehicleId = useVehicleId();

  const { initialValues, loading, load } = useInitialValues(rideId);
  const onSubmit = useOnSubmit(rideId, onSaved);

  useEffect(() => {
    if (open && rideId) {
      load({ id: rideId, vehicleId });
    }
  }, [load, open, rideId, vehicleId]);

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <Form<RideFormValues> onSubmit={onSubmit} initialValues={initialValues}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <AppBar sx={{ position: "relative" }}>
              <Toolbar>
                <IconButton edge="start" onClick={onClose}>
                  <CloseIcon />
                </IconButton>
                {rideId ? "Editing a ride" : "Creating a ride"}
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
