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
    | undefined
    | null;
  format: (value: Value | undefined | null) => string | undefined;
}) => (
  <InfoField
    loading={loading}
    label={label}
    underline={formatDateTime(data?.date)}
  >
    {!loading && data ? format(data.value) : null}
  </InfoField>
);

export default InfoFieldWithDate;
