import {
  Button,
  ButtonGroup,
  Grid,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { FC, useCallback, useRef, useState } from "react";
import RideForm from "../components/RideForm";
import AddFab from "../components/AddFab";
import { useLazyApi } from "../api";
import { useVehicleId } from "../hooks/vehicle";
import { useNavigate } from "react-router-dom";
import Routes from "../consts/Routes";
import {
  mapToCreatePayload,
  toReturnValues,
} from "../components/RideForm/helpers";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import { RideFormValues } from "../components/RideForm/types";

interface Ride {
  id: number;
  initialValues?: RideFormValues;
}

const NewRidePage: FC = () => {
  const vehicleId = useVehicleId();

  const lastIdRef = useRef(1);

  const [rides, setRides] = useState<Ride[]>([{ id: lastIdRef.current }]);
  const addRide = useCallback((initialValues?: RideFormValues) => {
    const nextId = (lastIdRef.current += 1);
    setRides((prev) => [...prev, { id: nextId, initialValues }]);
  }, []);

  const { invoke: createRide } = useLazyApi((_) => _.createRide);

  const navigate = useNavigate();

  return (
    <>
      <AddFab onClick={() => addRide()} />
      <Grid container spacing={3}>
        {rides.map(({ id, initialValues }) => (
          <Grid item xs={12} key={id}>
            <Paper>
              <RideForm
                onSubmit={async (values) => {
                  const payload = mapToCreatePayload(vehicleId, values);
                  await createRide(payload);
                  setRides((prev) => {
                    if (prev.length === 1) navigate(Routes.RIDES);
                    return prev.filter(({ id: id2 }) => id2 !== id);
                  });
                }}
                initialValues={initialValues}
                wrap={(children, { submitting, values }) => (
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
                          sx={{ marginRight: "1rem" }}
                        >
                          Create
                        </Button>
                        <ButtonGroup
                          variant="text"
                          sx={{ verticalAlign: "middle", marginRight: "1rem" }}
                          size="small"
                          color="inherit"
                        >
                          <Tooltip title="Return ride" placement="top">
                            <Button
                              onClick={() => addRide(toReturnValues(values))}
                              disabled={submitting}
                            >
                              <KeyboardReturnIcon />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Duplicate ride" placement="top">
                            <Button
                              onClick={() => addRide(values)}
                              disabled={submitting}
                            >
                              <ContentCopyIcon />
                            </Button>
                          </Tooltip>
                        </ButtonGroup>
                        <Tooltip title="Remove ride" placement="top">
                          <Button
                            size="small"
                            color="error"
                            variant="contained"
                            onClick={() =>
                              setRides((prev) => {
                                if (prev.length === 1) navigate(Routes.RIDES);
                                return prev.filter(({ id: id2 }) => id2 !== id);
                              })
                            }
                            disabled={submitting}
                            sx={{ minWidth: "unset" }}
                          >
                            <CloseIcon />
                          </Button>
                        </Tooltip>
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
