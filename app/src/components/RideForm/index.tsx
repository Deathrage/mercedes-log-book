import { DialogContent, Divider, Grid, Typography } from "@mui/material";
import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { PointParametersType, RideFormHandle, RideFormValues } from "./types";
import PointParameters from "./PointParameters";
import { Form } from "react-final-form";
import TextInputField from "../fields/TextInputField";
import validate from "./validate";
import { FormApi, FormState } from "final-form";
import { useApi } from "../../api";
import { useVehicleId } from "../../hooks/vehicle";

const RideForm = forwardRef<
  RideFormHandle,
  {
    disabled?: boolean;
    initialValues?: RideFormValues;
    onSubmit: (values: RideFormValues) => Promise<void>;
    wrap?: (content: ReactNode, state: FormState<RideFormValues>) => ReactNode;
  }
>(({ initialValues, onSubmit, disabled, wrap = (content) => content }, ref) => {
  const vehicleId = useVehicleId();
  const { data: vehicle } = useApi((_) => _.vehicle, {
    request: vehicleId,
  });

  const formRef = useRef<HTMLFormElement>();

  useImperativeHandle(
    ref,
    () => ({
      submit: () => {
        if (!formRef.current) throw new Error("Missing ref!");
        formRef.current.dispatchEvent(
          new Event("submit", { cancelable: true })
        );
      },
    }),
    []
  );

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
});

export default RideForm;
