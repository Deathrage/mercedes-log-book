import { TextField } from "@mui/material";
import React, { FC } from "react";
import { Field } from "react-final-form";

const TextInputField: FC<{
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
}> = ({ name, label, required, disabled }) => (
  <Field<string> name={name}>
    {({ input }) => (
      <TextField
        label={label}
        required={required}
        variant="filled"
        fullWidth
        disabled={disabled}
        {...input}
      />
    )}
  </Field>
);

export default TextInputField;
