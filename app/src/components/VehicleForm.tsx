import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { FormState, FormApi } from "final-form";
import React, { ReactNode, useCallback } from "react";
import { FC } from "react";
import { Field, Form } from "react-final-form";
import PropulsionType from "../../../api/model-shared/PropulsionType";
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

const VehicleForm: FC<{
  initialValues?: VehicleFormValues;
  onSubmit: (values: VehicleFormValues) => Promise<void>;
  wrap: (content: ReactNode, state: FormState<VehicleFormValues>) => ReactNode;
}> = ({ initialValues, onSubmit, wrap }) => {
  const submit = useCallback(
    async (values: VehicleFormValues, formApi: FormApi<VehicleFormValues>) => {
      await onSubmit(values);
      formApi.restart();
    },
    [onSubmit]
  );

  return (
    <Form<VehicleFormValues> onSubmit={submit} initialValues={initialValues}>
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
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextInputField name="license" label="License plate" />
                </Grid>
                <Grid item xs={4}>
                  <TextInputField name="model" label="Model" />
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
                    suffix="L"
                  />
                </Grid>
                <Grid item xs={4}>
                  <NumberInputField
                    name="batteryCapacity"
                    label="Battery capacity"
                    required={requireBattery}
                    disabled={!requireBattery}
                    suffix="kWh"
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
