import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
} from "@mui/material";
import { PropulsionType } from "@shared/model";
import { FormState, FormApi, ValidationErrors } from "final-form";
import React, { ReactNode, useCallback } from "react";
import { FC } from "react";
import { Field, Form } from "react-final-form";
import { numberIsGreater, numberIsMultiple } from "src/helpers/form";
import NumberInputField from "./fields/NumberInputField";
import TextInputField from "./fields/TextInputField";

export interface VehicleFormValues {
  vin: string;
  license?: string;
  model?: string;
  propulsion: PropulsionType;
  gasCapacity?: number;
  batteryCapacity?: number;
}

const validate = (values: VehicleFormValues): ValidationErrors => {
  const errors: ValidationErrors = {};

  numberIsGreater(values, "gasCapacity", errors).than(0);
  numberIsGreater(values, "batteryCapacity", errors).than(0);

  numberIsMultiple(values, "gasCapacity", errors).of(1);
  numberIsMultiple(values, "batteryCapacity", errors).of(0.1, 10);

  return errors;
};

const VehicleForm: FC<{
  loading?: boolean;
  initialValues?: VehicleFormValues;
  onSubmit: (values: VehicleFormValues) => Promise<void>;
  wrap?: (content: ReactNode, state: FormState<VehicleFormValues>) => ReactNode;
}> = ({ initialValues, loading, onSubmit, wrap = (content) => content }) => {
  const submit = useCallback(
    async (values: VehicleFormValues, formApi: FormApi<VehicleFormValues>) => {
      await onSubmit(values);
      formApi.restart();
    },
    [onSubmit]
  );

  return (
    <Form<VehicleFormValues>
      onSubmit={submit}
      initialValues={initialValues}
      validate={validate}
    >
      {({ handleSubmit, ...formState }) => {
        const requireGas = [
          PropulsionType.COMBUSTION,
          PropulsionType.PLUGIN_HYBRID,
        ].includes(formState.values.propulsion);

        const requireBattery = [
          PropulsionType.ELECTRICITY,
          PropulsionType.PLUGIN_HYBRID,
        ].includes(formState.values.propulsion);

        return (
          <form onSubmit={handleSubmit}>
            {wrap(
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <TextInputField
                    name="vin"
                    required
                    label="VIN code"
                    disabled={!!initialValues}
                    loading={loading}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextInputField
                    name="license"
                    label="License plate"
                    loading={loading}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextInputField
                    name="model"
                    label="Model"
                    loading={loading}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Field<PropulsionType> name="propulsion">
                    {({ input }) => (
                      <FormControl required fullWidth variant="filled">
                        <InputLabel
                          required
                          id="propulsion-label"
                          variant="filled"
                        >
                          Propulsion
                        </InputLabel>
                        <Select
                          labelId="propulsion-label"
                          label="Propulsion"
                          required
                          slots={{
                            input: loading
                              ? () => (
                                  <Skeleton
                                    sx={{
                                      margin: "25px 12px 8px",
                                      width: "100%",
                                    }}
                                  />
                                )
                              : undefined,
                          }}
                          {...input}
                        >
                          <MenuItem value={PropulsionType.COMBUSTION}>
                            Combustion
                          </MenuItem>
                          <MenuItem value={PropulsionType.ELECTRICITY}>
                            Electric
                          </MenuItem>
                          <MenuItem value={PropulsionType.PLUGIN_HYBRID}>
                            Plugin hybrid
                          </MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </Field>
                </Grid>
                <Grid item xs={4}>
                  <NumberInputField
                    name="gasCapacity"
                    label="Gas capacity"
                    required={requireGas}
                    disabled={!requireGas}
                    step={1}
                    suffix="L"
                    loading={loading}
                  />
                </Grid>
                <Grid item xs={4}>
                  <NumberInputField
                    name="batteryCapacity"
                    label="Battery capacity"
                    required={requireBattery}
                    disabled={!requireBattery}
                    step={0.1}
                    suffix="kWh"
                    loading={loading}
                  />
                </Grid>
              </Grid>,
              formState
            )}
          </form>
        );
      }}
    </Form>
  );
};

export default VehicleForm;
