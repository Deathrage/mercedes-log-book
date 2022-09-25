import {
  AppBar,
  Button,
  Card,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { FC, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { FormProvider, useForm } from "react-hook-form";
import { PointParametersType, RideFormValues } from "./types";
import PointParameters from "./PointParameters";

const RideDialog: FC<{
  open: boolean;
  onSaved: () => void;
  onClose: () => void;
  rideId?: string;
}> = ({ rideId, open, onClose }) => {
  const form = useForm<RideFormValues>();
  useEffect(() => {
    if (!open) form.reset();
  }, [open, form]);

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(console.log)}>
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
                    <TextField
                      label="Reason"
                      variant="filled"
                      fullWidth
                      {...form.register("reason")}
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      label="Note"
                      multiline
                      rows={4}
                      variant="filled"
                      fullWidth
                      {...form.register("note")}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default RideDialog;
