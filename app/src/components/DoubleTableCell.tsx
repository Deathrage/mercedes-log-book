import { Stack, TableCell, Typography } from "@mui/material";
import React, { FC, ReactNode } from "react";

export const DoubleTableCell: FC<{ first: ReactNode; second: ReactNode }> = ({
  first,
  second,
}) => (
  <TableCell>
    <Stack>
      <Typography>{first}</Typography>
      <Typography>{second}</Typography>
    </Stack>
  </TableCell>
);
