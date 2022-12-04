import { DialogContent, Divider, Grid, Typography } from "@mui/material";
import React, { FC, ReactNode, useCallback, useRef } from "react";
import { PointParametersType, RideFormValues } from "./types";
import PointParameters from "./PointParameters";
import { Form } from "react-final-form";
import TextInputField from "../fields/TextInputField";
import validate from "./validate";
import { FormApi, FormState } from "final-form";
import { useApi } from "../../api";
import { useVehicleId } from "../../hooks/vehicle";

const RideForm: FC<{
  disabled?: boolean;
  initialValues?: RideFormValues;
  onSubmit: (values: RideFormValues) => Promise<void>;
  wrap?: (content: ReactNode, state: FormState<RideFormValues>) => ReactNode;
}> = ({
  initialValues,
  onSubmit,
  disabled: parentDisabled,
  wrap = (content) => content,
}) => {
  const vehicleId = useVehicleId();
  const { data: vehicle, running: vehicleLoading } = useApi((_) => _.vehicle, {
    request: vehicleId,
  });
  const { data: addresses, running: addressesLoading } = useApi(
    (_) => _.currentUserAddresses
  );
  const disabled = parentDisabled || vehicleLoading || addressesLoading;

  const formRef = useRef<HTMLFormElement>();

  return (
    <Form<RideFormValues>
      onSubmit={useCallback(
        async (values: RideFormValues, formApi: FormApi<RideFormValues>) => {
          await onSubmit?.(values);
          formApi.restart();
        },
        [onSubmit]
      )}
      initialValues={initialValues}
      validate={validate}
    >
      {({ handleSubmit, ...state }) => (
        <form
          onSubmit={handleSubmit}
          ref={(ref) => {
            if (ref) formRef.current = ref;
          }}
        >
          {wrap(
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <PointParameters
                    type={PointParametersType.START}
                    disabled={disabled}
                    capacity={{
                      gas: vehicle?.capacity.gas,
                      battery: vehicle?.capacity.battery,
                    }}
                    propulsion={vehicle?.propulsion}
                    addresses={addresses}
                  />
                </Grid>
                <Grid item xs={6}>
                  <PointParameters
                    type={PointParametersType.END}
                    disabled={disabled}
                    capacity={{
                      gas: vehicle?.capacity.gas,
                      battery: vehicle?.capacity.battery,
                    }}
                    propulsion={vehicle?.propulsion}
                    addresses={addresses}
                  />
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
                      <TextInputField
                        name="reason"
                        label="Reason"
                        disabled={disabled}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <TextInputField
                        name="note"
                        label="Note"
                        disabled={disabled}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>,
            state
          )}
        </form>
      )}
    </Form>
  );
};

export default RideForm;
