import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import deepEqual from "deep-equal";
import React, { ReactNode, useEffect, useRef } from "react";
import { FC } from "react";
import { FormState, useForm } from "react-hook-form";
import PropulsionType from "../../../api/model-shared/PropulsionType";

export interface VehicleFormValues {
  vin: string;
  license?: string;
  model?: string;
  propulsion: PropulsionType;
  gasCapacity?: number;
  batteryCapacity?: number;
}

const VehicleForm: FC<{
  initialValues?: VehicleFormValues;
  onSubmit: (values: VehicleFormValues) => Promise<void>;
  wrap: (content: ReactNode, state: FormState<VehicleFormValues>) => ReactNode;
}> = ({ initialValues, onSubmit, wrap }) => {
  const { register, handleSubmit, watch, formState, reset } =
    useForm<VehicleFormValues>({
      defaultValues: initialValues,
    });
  const { propulsion } = watch();

  const lastInitialValuesRef = useRef(initialValues);
  useEffect(() => {
    // If initial values change reset form to is no longer dirty.
    // Compared to React Final Form, no dirtySinceLastSubmit is available
    if (!deepEqual(lastInitialValuesRef.current, initialValues))
      reset(initialValues);

    lastInitialValuesRef.current = initialValues;
  }, [initialValues, reset]);

  const requireGas = [
    PropulsionType.COMBUSTION,
    PropulsionType.PLUGIN_HYBRID,
  ].includes(propulsion);

  const requireBattery = [
    PropulsionType.ELECTRICITY,
    PropulsionType.PLUGIN_HYBRID,
  ].includes(propulsion);

  const content = (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <TextField
          required
          label="VIN code"
          variant="filled"
          disabled={!!initialValues}
          fullWidth
          {...register("vin")}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="License plate"
          variant="filled"
          fullWidth
          {...register("license")}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Model"
          variant="filled"
          fullWidth
          {...register("model")}
        />
      </Grid>
      <Grid item xs={4}>
        <FormControl required fullWidth variant="filled">
          <InputLabel required id="propulsion-label" variant="filled">
            Propulsion
          </InputLabel>
          <Select
            labelId="propulsion-label"
            label="Propulsion"
            required
            variant="filled"
            {...register("propulsion")}
            // Does not work properly with hook form, initial value has to be provided explicitly
            defaultValue={initialValues?.propulsion}
          >
            <MenuItem value={PropulsionType.COMBUSTION}>Combustion</MenuItem>
            <MenuItem value={PropulsionType.ELECTRICITY}>Electric</MenuItem>
            <MenuItem value={PropulsionType.PLUGIN_HYBRID}>
              Plugin hybrid
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Gas capacity"
          variant="filled"
          fullWidth
          type="number"
          required={requireGas}
          InputProps={{ endAdornment: "l" }}
          {...register("gasCapacity", {
            valueAsNumber: true,
          })}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Battery capacity"
          variant="filled"
          fullWidth
          type="number"
          inputMode="decimal"
          inputProps={{
            step: "0.1",
          }}
          required={requireBattery}
          InputProps={{ endAdornment: "kWh" }}
          {...register("batteryCapacity", {
            valueAsNumber: true,
          })}
        />
      </Grid>
    </Grid>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>{wrap(content, formState)}</form>
  );
};

export default VehicleForm;
