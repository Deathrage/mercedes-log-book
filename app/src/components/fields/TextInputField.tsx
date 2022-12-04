import { Skeleton, SxProps, TextField } from "@mui/material";
import React, { FC } from "react";
import { Field } from "react-final-form";

const TextInputField: FC<{
  name: string;
  label?: string;
  loading?: boolean;
  required?: boolean;
  disabled?: boolean;
  sx?: SxProps;
}> = ({ name, label, required, loading, disabled, sx }) => (
  <Field<string> name={name}>
    {({ input, meta: { error } }) => (
      <TextField
        label={label}
        required={required}
        variant="filled"
        fullWidth
        disabled={disabled || loading}
        error={error}
        helperText={error}
        sx={sx}
        {...input}
        InputProps={{
          slots: {
            input: loading
              ? () => (
                  <Skeleton sx={{ margin: "25px 12px 8px", width: "100%" }} />
                )
              : undefined,
          },
        }}
      />
    )}
  </Field>
);

export default TextInputField;
