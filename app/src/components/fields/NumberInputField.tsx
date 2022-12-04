import { Skeleton, SxProps, TextField } from "@mui/material";
import React, { FC } from "react";
import { Field } from "react-final-form";

const NumberInputField: FC<{
  name: string;
  label: string;
  required?: boolean;
  suffix?: string;
  rate?: number;
  step?: number;
  helperText?: string;
  disabled?: boolean;
  decimals?: number;
  loading?: boolean;
  sx?: SxProps;
}> = ({
  name,
  label,
  disabled,
  required,
  suffix,
  rate,
  helperText,
  step,
  decimals = 2,
  loading,
  sx,
}) => (
  <Field<number> name={name}>
    {({ input: { value, onChange, ...input }, meta: { error } }) => (
      <TextField
        label={label}
        required={required}
        variant="filled"
        type="number"
        sx={sx}
        InputProps={{
          endAdornment: suffix,
          slots: {
            input: loading
              ? () => (
                  <Skeleton sx={{ margin: "25px 12px 8px", width: "100%" }} />
                )
              : undefined,
          },
        }}
        inputProps={{ step }}
        fullWidth
        disabled={disabled}
        value={
          typeof value === "number"
            ? Number((value * (rate ?? 1)).toFixed(decimals))
            : ""
        }
        onChange={(e) =>
          onChange(
            e.target.value ? Number(e.target.value) / (rate ?? 1) : undefined
          )
        }
        error={error}
        helperText={error ?? helperText}
        {...input}
      />
    )}
  </Field>
);

export default NumberInputField;
