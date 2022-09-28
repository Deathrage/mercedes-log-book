import { TextField } from "@mui/material";
import moment from "moment";
import React, { FC } from "react";
import { Field } from "react-final-form";

const DateInputField: FC<{
  name: string;
  label: string;
  required?: boolean;
}> = ({ name, label, required }) => (
  <Field<Date> name={name}>
    {({ input: { value, onChange, ...input }, meta: { error } }) => (
      <TextField
        label={label}
        type="datetime-local"
        variant="filled"
        required={required}
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        value={value ? moment(value).format("YYYY-MM-DDTHH:mm") : ""}
        onChange={(e) =>
          onChange(e.target.value ? moment(e.target.value).toDate() : undefined)
        }
        error={error}
        helperText={error}
        {...input}
      />
    )}
  </Field>
);

export default DateInputField;
