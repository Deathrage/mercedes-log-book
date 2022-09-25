import { FormHelperText, Skeleton, Stack, Typography } from "@mui/material";
import React, { FC, PropsWithChildren } from "react";

const InfoField: FC<
  PropsWithChildren<{
    label: string;
    loading?: boolean;
    underline?: string;
  }>
> = ({ label, loading, children, underline }) => (
  <Stack>
    <Typography variant="overline">{label}</Typography>
    {loading ? (
      <Skeleton />
    ) : (
      <Typography variant="body2" sx={(theme) => ({ borderBottom: 1 })}>
        {children ?? "-"}
      </Typography>
    )}
    {underline && <FormHelperText>{underline}</FormHelperText>}
  </Stack>
);

export default InfoField;
