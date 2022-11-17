import {
  AppBar,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { FC, ReactNode, useCallback } from "react";
import { PointParametersType, RideFormValues } from "./types";
import PointParameters from "./PointParameters";
import { Form } from "react-final-form";
import TextInputField from "../fields/TextInputField";
import validate from "./validate";
import { FormApi, FormState } from "final-form";

const RideForm: FC<{
  header?: (state: FormState<RideFormValues>) => ReactNode;
  initialValues?: RideFormValues;
  leftInfoField?: ReactNode;
  onSubmit: (values: RideFormValues) => Promise<void>;
}> = ({ header, leftInfoField, initialValues, onSubmit }) => {
  const submit = useCallback(
    async (values: RideFormValues, formApi: FormApi<RideFormValues>) => {
      await onSubmit(values);
      formApi.restart();
    },
    [onSubmit]
  );

  return (
    <Form<RideFormValues>
      onSubmit={submit}
      initialValues={initialValues}
      validate={validate}
    >
      {({ handleSubmit, ...state }) => (
        <form onSubmit={handleSubmit}>
          {header?.(state)}

          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <PointParameters
                  type={PointParametersType.START}
                  infoField={leftInfoField}
                />
              </Grid>
              <Grid item xs={6}>
                <PointParameters type={PointParametersType.END} />
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
                    <TextInputField name="reason" label="Reason" />
                  </Grid>
                  <Grid item xs={8}>
                    <TextInputField name="note" label="Note" />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
        </form>
      )}
    </Form>
  );
};

export default RideForm;
