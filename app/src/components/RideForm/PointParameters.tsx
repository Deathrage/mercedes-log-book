import { Grid, Typography } from "@mui/material";
import React, { FC } from "react";
import { useField } from "react-final-form";
import { formatKilowattHours, formatLiters } from "../../helpers/formatters";
import PropulsionType from "../../../../api/model-shared/PropulsionType";
import { useVehiclesContext } from "../vehicles/hooks";
import { PointParametersType } from "./types";
import { isNumber } from "src/helpers/predicate";
import DateInputField from "../fields/DateInputField";
import TextInputField from "../fields/TextInputField";
import NumberInputField from "../fields/NumberInputField";

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

  const {
    input: { value: gas },
  } = useField(isStart ? "startGas" : "endGas", {
    subscription: { value: true },
  });
  const {
    input: { value: battery },
  } = useField(isStart ? "startBattery" : "endBattery");

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">
            {isStart ? "Starting point" : "Destination"}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <DateInputField
            name={isStart ? "departed" : "arrived"}
            label={isStart ? "Departed" : "Arrived"}
            required={isStart}
          />
        </Grid>
        <Grid item xs={7}>
          <TextInputField
            name={isStart ? "startAddress" : "endAddress"}
            label="Address"
          />
        </Grid>
        <Grid item xs={5}>
          <NumberInputField
            name={isStart ? "startOdometer" : "endOdometer"}
            label="Odometer"
            suffix="km"
            step={1}
          />
        </Grid>
        <Grid item xs={7}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <NumberInputField
                name={isStart ? "startLatitude" : "endLatitude"}
                label="Latitude"
                suffix="°"
              />
            </Grid>
            <Grid item xs={6}>
              <NumberInputField
                name={isStart ? "startLongitude" : "endLongitude"}
                label="Longitude"
                suffix="°"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <NumberInputField
                name={isStart ? "startGas" : "endGas"}
                label="Gas"
                suffix="%"
                rate={100}
                step={1}
                disabled={!usesGas}
                helperText={
                  isNumber(gas) && isNumber(activeVehicle?.capacity.gas)
                    ? `Approx. ${formatLiters(
                        gas * activeVehicle!.capacity.gas
                      )}.`
                    : undefined
                }
              />
            </Grid>
            <Grid item xs={6}>
              <NumberInputField
                name={isStart ? "startBattery" : "endBattery"}
                label="Battery"
                suffix="%"
                rate={100}
                step={1}
                disabled={!usesBattery}
                helperText={
                  isNumber(battery) && isNumber(activeVehicle?.capacity.battery)
                    ? `Approx. ${formatKilowattHours(
                        battery * activeVehicle!.capacity.battery
                      )}.`
                    : undefined
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default PointParameters;
