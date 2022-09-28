import { Stack, TableCell, Typography } from "@mui/material";
import React, { FC, ReactNode } from "react";

export const DoubleTableCell: FC<{ first: ReactNode; second: ReactNode }> = ({
  first,
  second,
}) => (
  <TableCell>
    <Stack>
      <Typography
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: "1",
          WebkitBoxOrient: "vertical",
        }}
      >
        {first}
      </Typography>
      <Typography
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: "1",
          WebkitBoxOrient: "vertical",
        }}
      >
        {second}
      </Typography>
    </Stack>
  </TableCell>
);
