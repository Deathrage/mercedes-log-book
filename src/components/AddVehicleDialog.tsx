import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Toolbar,
} from "@mui/material";
import React, { FC, useState } from "react";
import VehicleForm from "./VehicleForm";
import { useVehiclesContext } from "./vehicles/hooks";
import CloseIcon from "@mui/icons-material/Close";
import { turnEmptyValuesToUndefined } from "src/helpers/form";

const AddVehicleDialog: FC = () => {
  const { activeVehicle, loading, createVehicle } = useVehiclesContext();

  const [creating, setCreating] = useState(false);

  return (
    <>
      <Dialog open={!loading && !activeVehicle}>
        <DialogTitle>Create your first vehicle</DialogTitle>
        <DialogContent>
          <DialogContentText>
            It seems that you have no vehicle. Please create your first vehicle
            in order to use the application. All vehicles have to be accessible
            through your Mercedes Me account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreating(true)}>Create vehicle</Button>
        </DialogActions>
      </Dialog>
      {creating && (
        <Dialog open onClose={() => setCreating(true)} fullScreen>
          <VehicleForm
            onSubmit={async (state) => {
              state = turnEmptyValuesToUndefined(state);
              await createVehicle({
                id: state.vin,
                license: state.license,
                model: state.model,
                propulsion: state.propulsion,
                capacity: {
                  gas: state.gasCapacity,
                  battery: state.batteryCapacity,
                },
              });
              setCreating(false);
            }}
            wrap={(children, { submitting, pristine }) => (
              <>
                <AppBar sx={{ position: "relative" }}>
                  <Toolbar>
                    <IconButton edge="start" onClick={() => setCreating(false)}>
                      <CloseIcon />
                    </IconButton>
                    Creating a vehicle
                    <Button
                      autoFocus
                      color="inherit"
                      sx={{ ml: "auto" }}
                      type="submit"
                      disabled={submitting || pristine}
                    >
                      Save
                    </Button>
                  </Toolbar>
                </AppBar>
                <DialogContent>{children}</DialogContent>
              </>
            )}
          />
        </Dialog>
      )}
    </>
  );
};

export default AddVehicleDialog;
