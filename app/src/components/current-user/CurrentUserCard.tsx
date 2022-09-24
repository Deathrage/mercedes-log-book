import { Box, Typography } from "@mui/material";
import React, { FC } from "react";
import { useCurrentUserContext } from "./hooks";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

const CurrentUserCard: FC = () => {
  const { username, mercedesBenzPaired } = useCurrentUserContext();

  return (
    <Box>
      <Typography>User: {username}</Typography>
      <Typography variant="body2" display="flex">
        Mercedes Benz connected:
        {mercedesBenzPaired ? <CheckIcon /> : <CloseIcon />}
      </Typography>
    </Box>
  );
};

export default CurrentUserCard;
