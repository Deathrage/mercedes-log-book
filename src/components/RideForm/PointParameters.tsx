import { Button, Grid, Typography } from "@mui/material";
import React, { FC, ReactNode } from "react";
import { useField } from "react-final-form";
import { formatKilowattHours, formatLiters } from "../../helpers/formatters";
import { PointParametersType } from "./types";
import DateInputField from "../fields/DateInputField";
import TextInputField from "../fields/TextInputField";
import NumberInputField from "../fields/NumberInputField";
import {
  hasCombustionEngine,
  hasElectricEngine,
} from "../../../../api/helpers-shared/propulsion";
import { useVehicle } from "src/hooks/vehicle";
import { isNumber } from "../../../../api/helpers-shared/predicate";

const PointParameters: FC<{
  type: PointParametersType;
  infoField?: ReactNode;
}> = ({ type, infoField }) => {
  const activeVehicle = useVehicle();

  const usesGas = hasCombustionEngine(activeVehicle.propulsion);
  const usesBattery = hasElectricEngine(activeVehicle.propulsion);

  const isStart = type === PointParametersType.START;

  const {
    input: { value: gas },
  } = useField(isStart ? "startGas" : "endGas", {
    subscription: { value: true },
  });
  const {
    input: { value: battery },
  } = useField(isStart ? "startBattery" : "endBattery", {
    subscription: { value: true },
  });
  const {
    input: { value: departed, onChange: onChangeDeparted },
  } = useField("departed", { subscription: { value: !isStart } });
  const {
    input: { onChange: onChangeArrived },
  } = useField("arrived", { subscription: {} });

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">
            {isStart ? "Starting point" : "Destination"}
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <DateInputField
            name={isStart ? "departed" : "arrived"}
            label={isStart ? "Departed" : "Arrived"}
            required={isStart}
          />
          {isStart && (
            <Button size="small" onClick={() => onChangeDeparted(new Date())}>
              Now
            </Button>
          )}
          {!isStart && (
            <Button
              size="small"
              onClick={() => {
                if (departed) onChangeArrived(departed);
              }}
            >
              Departed
            </Button>
          )}
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={3}>
          {infoField}
        </Grid>
        <Grid item xs={2} />
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
                decimals={7}
              />
            </Grid>
            <Grid item xs={6}>
              <NumberInputField
                name={isStart ? "startLongitude" : "endLongitude"}
                label="Longitude"
                suffix="°"
                decimals={7}
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
