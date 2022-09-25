import { Grid, TextField, Typography } from "@mui/material";
import React, { FC } from "react";
import { useFormContext } from "react-hook-form";
import { formatKilowattHours, formatLiters } from "src/helpers/formaters";
import PropulsionType from "../../../../api/model-shared/PropulsionType";
import { useVehiclesContext } from "../vehicles/hooks";
import { PointParametersType } from "./types";

const PointParameters: FC<{ type: PointParametersType }> = ({ type }) => {
  const { activeVehicle } = useVehiclesContext();
  const usesGas = [
    PropulsionType.COMBUSTION,
    PropulsionType.PLUGIN_HYBRID,
  ].includes(activeVehicle!.propulsion);
  const usesBattery = [
    PropulsionType.ELECTRICITY,
    PropulsionType.PLUGIN_HYBRID,
  ].includes(activeVehicle!.propulsion);

  const isStart = type === PointParametersType.START;

  const { watch, register } = useFormContext();
  const gas = watch(isStart ? "startGas" : "endGas");
  const battery = watch(isStart ? "startBattery" : "endBattery");

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">
            {isStart ? "Starting point" : "Destination"}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label={isStart ? "Departed" : "Arrived"}
            type="datetime-local"
            variant="filled"
            required={isStart}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            {...register(isStart ? "departed" : "arrived", {
              valueAsDate: true,
            })}
          />
        </Grid>
        <Grid item xs={7}>
          <TextField
            label="Address"
            variant="filled"
            fullWidth
            {...register(isStart ? "startAddress" : "endAddress")}
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            label="Odometer"
            variant="filled"
            fullWidth
            type="number"
            InputProps={{ endAdornment: "km" }}
            {...register(isStart ? "startOdometer" : "endOdometer", {
              valueAsNumber: true,
            })}
          />
        </Grid>
        <Grid item xs={7}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                variant="filled"
                label="Latitude"
                type="number"
                fullWidth
                InputProps={{ endAdornment: "°" }}
                {...register(isStart ? "startLatitude" : "endLatitude", {
                  valueAsNumber: true,
                })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="filled"
                fullWidth
                type="number"
                label="Longitude"
                InputProps={{ endAdornment: "°" }}
                {...register(isStart ? "startLongitude" : "endLongitude", {
                  valueAsNumber: true,
                })}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                type="number"
                variant="filled"
                label="Gas"
                disabled={!usesGas}
                InputProps={{ endAdornment: "%" }}
                fullWidth
                helperText={
                  gas && activeVehicle?.capacity.gas
                    ? `Approx. ${formatLiters(
                        (gas / 100) * activeVehicle.capacity.gas
                      )}.`
                    : undefined
                }
                {...register(isStart ? "startGas" : "endGas", {
                  valueAsNumber: true,
                })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                variant="filled"
                fullWidth
                InputProps={{ endAdornment: "%" }}
                disabled={!usesBattery}
                label="Battery"
                helperText={
                  battery && activeVehicle?.capacity.battery
                    ? `Approx. ${formatKilowattHours(
                        (battery / 100) * activeVehicle.capacity.battery
                      )}.`
                    : undefined
                }
                {...register(isStart ? "startBattery" : "endBattery", {
                  valueAsNumber: true,
                })}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default PointParameters;
