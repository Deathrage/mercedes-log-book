import { Link, Typography, TypographyProps } from "@mui/material";
import React, { FC } from "react";

const Copyright: FC<TypographyProps> = (props) => (
  <Typography variant="body2" color="text.secondary" align="center" {...props}>
    {"Copyright © "}
    <Link color="inherit" href="https://mui.com/">
      Your Website
    </Link>{" "}
    {new Date().getFullYear()}
    {"."}
  </Typography>
);

export default Copyright;
