import { Button, Fab, Grid, Paper, Stack, Typography } from "@mui/material";
import React, { FC, useCallback, useRef, useState } from "react";
import VehicleStatus from "../../components/VehicleStatus";
import RideForm from "../../components/RideForm";
import CloseIcon from "@mui/icons-material/Close";
import AddFab from "../../components/AddFab";
import { useLazyApi } from "src/api";
import { mapToCreatePayload } from "src/components/RideDialog/helpers";
import { useVehicleId } from "src/hooks/vehicle";
import { useNavigate } from "react-router-dom";
import Routes from "../../consts/Routes";

const NewRidePage: FC = () => {
  const vehicleId = useVehicleId();

  const lastIdRef = useRef(1);

  const [rides, setRides] = useState<number[]>([1]);
  const addRide = useCallback(() => {
    const nextId = (lastIdRef.current += 1);
    setRides((prev) => [...prev, nextId]);
  }, []);

  const { invoke: createRide } = useLazyApi((_) => _.createRide);

  const navigate = useNavigate();

  return (
    <>
      <AddFab onClick={addRide} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, pb: 5 }}>
            <VehicleStatus hideRanges />
          </Paper>
        </Grid>
        {rides.map((id) => (
          <Grid item xs={12} key={id}>
            <Paper>
              <RideForm
                onSubmit={async (values) => {
                  const payload = mapToCreatePayload(vehicleId, values);
                  await createRide(payload);
                  setRides((prev) => {
                    if (prev.length === 1) navigate(Routes.RIDES);
                    return prev.filter((id2) => id2 !== id);
                  });
                }}
                wrap={(children, { submitting }) => (
                  <>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ p: "1rem 1.5rem 0" }}
                    >
                      <Typography variant="h5">{`Ride ${id}`}</Typography>
                      <div>
                        <Button
                          variant="contained"
                          color="secondary"
                          type="submit"
                          disabled={submitting}
                          sx={{ mr: "1rem" }}
                        >
                          Create
                        </Button>
                        <Fab
                          size="small"
                          onClick={() =>
                            setRides((prev) => {
                              if (prev.length === 1) navigate(Routes.RIDES);
                              return prev.filter((id2) => id2 !== id);
                            })
                          }
                          color="error"
                          disabled={submitting}
                        >
                          <CloseIcon />
                        </Fab>
                      </div>
                    </Stack>
                    {children}
                  </>
                )}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default NewRidePage;
