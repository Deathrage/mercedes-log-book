import { Link, Typography, TypographyProps } from "@mui/material";
import React, { FC } from "react";

const Copyright: FC<TypographyProps> = (props) => (
  <Typography variant="body2" color="text.secondary" align="center" {...props}>
    All rights reserved.
    <br />
    <Link color="inherit" href="https://www.lukasprochazka.net" sx={{ ml: 1 }}>
      Lukáš Procházka
    </Link>
    {" © "}
    {new Date().getFullYear()}
  </Typography>
);

export default Copyright;
