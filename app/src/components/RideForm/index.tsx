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
import CloseIcon from "@mui/icons-material/Close";
import { PointParametersType, RideFormValues } from "./types";
import PointParameters from "./PointParameters";
import { Form } from "react-final-form";
import TextInputField from "../fields/TextInputField";
import validate from "./validate";
import { FormApi } from "final-form";

const RideForm: FC<{
  title: string;
  open: boolean;
  loading: boolean;
  initialValues?: RideFormValues;
  leftInfoField?: ReactNode;
  onSubmit: (values: RideFormValues) => Promise<void>;
  onClose: () => void;
}> = ({
  title,
  leftInfoField,
  open,
  loading,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const submit = useCallback(
    async (values: RideFormValues, formApi: FormApi<RideFormValues>) => {
      await onSubmit(values);
      formApi.restart();
    },
    [onSubmit]
  );

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <Form<RideFormValues>
        onSubmit={submit}
        initialValues={initialValues}
        validate={validate}
      >
        {({ handleSubmit, submitting, pristine }) => (
          <form onSubmit={handleSubmit}>
            <AppBar sx={{ position: "relative" }}>
              <Toolbar>
                <IconButton edge="start" onClick={onClose}>
                  <CloseIcon />
                </IconButton>
                {title}
                <Button
                  autoFocus
                  color="inherit"
                  sx={{ ml: "auto" }}
                  type="submit"
                  disabled={loading || submitting || pristine}
                >
                  Save
                </Button>
              </Toolbar>
            </AppBar>
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
    </Dialog>
  );
};

export default RideForm;
