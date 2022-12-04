import {
  Autocomplete,
  Skeleton,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import React, { FC } from "react";
import { Field } from "react-final-form";
const AutocompleteTextInputField: FC<{
  name: string;
  options: {
    label: string;
    value: string | number;
  }[];
  label?: string;
  loading?: boolean;
  required?: boolean;
  disabled?: boolean;
  sx?: SxProps;
}> = ({ name, options, label, loading, required, disabled, sx }) => (
  <Field<string> name={name}>
    {({ input: { onChange, ...input }, meta: { error } }) => (
      <Autocomplete
        options={options.map((o) => o.value)}
        freeSolo
        sx={sx}
        fullWidth
        disabled={disabled || loading}
        {...input}
        onChange={(_, value) => onChange(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            required={required}
            label={label}
            error={error}
            helperText={error}
            variant="filled"
            InputProps={{
              slots: {
                input: loading
                  ? () => (
                      <Skeleton sx={{ margin: "8px 12px", width: "100%" }} />
                    )
                  : undefined,
              },
              ...params.InputProps,
            }}
          />
        )}
        renderOption={(props, optionValue) => {
          const option = options.find((o) => o.value === optionValue);
          if (!option) throw new Error(`Option ${optionValue} does not exist!`);

          return (
            <li {...props}>
              <Typography
                variant="body2"
                component="span"
                sx={{ paddingRight: "0.5rem" }}
              >
                {option.label}
              </Typography>
              <Typography variant="body2" component="span" fontSize="0.75rem">
                {option.value}
              </Typography>
            </li>
          );
        }}
      />
    )}
  </Field>
);

export default AutocompleteTextInputField;
