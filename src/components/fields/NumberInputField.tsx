import { TextField } from "@mui/material";
import React, { FC } from "react";
import { Field } from "react-final-form";
import { isNumber } from "../../../../api/helpers-shared/predicate";

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
}) => (
  <Field<number> name={name}>
    {({ input: { value, onChange, ...input }, meta: { error } }) => (
      <TextField
        label={label}
        required={required}
        variant="filled"
        type="number"
        InputProps={{ endAdornment: suffix }}
        inputProps={{ step }}
        fullWidth
        disabled={disabled}
        value={
          isNumber(value) ? Number((value * (rate ?? 1)).toFixed(decimals)) : ""
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
