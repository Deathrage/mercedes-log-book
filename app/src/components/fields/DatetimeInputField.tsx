import { SxProps } from "@mui/material";
import { DateTimePicker, renderTimeViewClock } from "@mui/x-date-pickers";
import React, { FC } from "react";
import { isValid, parse } from "date-fns";
import { Field } from "react-final-form";

const format = "dd.MM.yyyy HH:mm:ss";

const DatetimeInputField: FC<{
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  sx?: SxProps;
}> = ({ name, label, required, disabled, sx }) => (
  <Field<Date> name={name}>
    {({ input: { value, onChange, ...input }, meta: { error } }) => (
      <DateTimePicker<Date>
        format={format}
        ampm={false}
        label={label}
        slotProps={{
          textField: {
            variant: "filled",
            required,
            fullWidth: true,
            InputLabelProps: {
              shrink: true,
            },
            error,
            helperText: error,
            onPasteCapture: (e) => {
              const data = e.clipboardData
                .getData("Text")
                // Mui forces in invisible characters
                ?.replaceAll("\u2069", "")
                .replaceAll("\u2066", "");
              if (!data) return;

              const date = parse(data, format, new Date());
              if (!isValid(date)) return;

              onChange(date);

              e.stopPropagation();
            },
          },
        }}
        viewRenderers={{
          hours: renderTimeViewClock,
          minutes: renderTimeViewClock,
          seconds: renderTimeViewClock,
        }}
        value={value || null}
        onChange={onChange}
        sx={sx}
        disabled={disabled}
        {...input}
      />
    )}
  </Field>
);

export default DatetimeInputField;
