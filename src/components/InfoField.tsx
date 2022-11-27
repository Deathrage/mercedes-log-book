import { FormHelperText, Skeleton, Stack, Typography } from "@mui/material";
import React, { FC, PropsWithChildren } from "react";

const InfoField: FC<
  PropsWithChildren<{
    label: string;
    loading?: boolean;
    underline?: string;
    noBorder?: boolean;
  }>
> = ({ label, loading, children, underline, noBorder }) => (
  <Stack position="relative">
    <Typography variant="overline">{label}</Typography>
    {loading ? (
      <Skeleton />
    ) : (
      <Typography
        variant="body2"
        sx={() => ({ borderBottom: noBorder ? undefined : 1 })}
      >
        {children ?? "-"}
      </Typography>
    )}
    {underline && (
      <FormHelperText sx={{ position: "absolute", bottom: "-1.25rem" }}>
        {underline}
      </FormHelperText>
    )}
  </Stack>
);

export default InfoField;
