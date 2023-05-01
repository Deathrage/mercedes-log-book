import { Grid } from "@mui/material";
import { FormState } from "final-form";
import React, { FC, ReactNode, useCallback } from "react";
import { Form } from "react-final-form";
import { useLazyApi } from "src/api";
import { useVehicleId } from "../../hooks/vehicle";
import DatetimeInputField from "../fields/DatetimeInputField";
import { getInitialValue, getTitle } from "./helpers";
import { RideReportFormValues, RideReportType } from "./types";
import { saveAs } from "file-saver";
import { format } from "date-fns";

const RideReportForm: FC<{
  type: RideReportType;
  disabled: boolean;
  onClose: () => void;
  wrap?: (
    title: string,
    content: ReactNode,
    state: FormState<RideReportFormValues>
  ) => ReactNode;
}> = ({ type, disabled, onClose, wrap = (children) => children }) => {
  const vehicleId = useVehicleId();

  const { invoke } = useLazyApi((_) => _.rideReport);

  const generate = useCallback(
    async (values: RideReportFormValues) => {
      if (!values.to || !values.from)
        throw new Error("From or to is not filled!");

      const filename = `Rides_${vehicleId}_${format(
        values.from,
        "yyyy.MM.dd"
      )}-${format(values.to, "yyyy.MM.dd")}.xlsx`;

      const blob = await invoke({
        vehicleId,
        from: values.from,
        to: values.to,
      });

      saveAs(blob, filename);
      onClose();
    },
    [invoke, onClose, vehicleId]
  );

  return (
    <Form<RideReportFormValues>
      onSubmit={generate}
      initialValues={getInitialValue(type)}
    >
      {({ handleSubmit, ...state }) => (
        <form onSubmit={handleSubmit}>
          {wrap(
            getTitle(type),
            <Grid spacing={3} container>
              <Grid item xs={6}>
                <DatetimeInputField
                  name="from"
                  label="From"
                  disabled={disabled || type !== RideReportType.CUSTOM}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <DatetimeInputField
                  name="to"
                  label="To"
                  disabled={disabled || type !== RideReportType.CUSTOM}
                  required
                />
              </Grid>
            </Grid>,
            state
          )}
        </form>
      )}
    </Form>
  );
};

export default RideReportForm;
