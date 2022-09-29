import React from "react";
import { formatDateTime } from "../helpers/formatters";
import InfoField from "./InfoField";

const InfoFieldWithDate = <Value extends unknown>({
  label,
  data,
  loading,
  format,
}: {
  label: string;
  loading: boolean;
  data:
    | {
        value: Value;
        date: Date;
      }
    | undefined;
  format: (value: Value | undefined | null) => string | undefined;
}) => (
  <InfoField
    loading={loading}
    label={label}
    underline={formatDateTime(data?.date)}
  >
    {data && format(data.value)}
  </InfoField>
);

export default InfoFieldWithDate;
