import React, { FC } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";

const AddFab: FC<{ onClick: () => void; disabled?: boolean }> = ({
  onClick,
  disabled,
}) => (
  <Fab
    disabled={disabled}
    aria-label="add"
    sx={{ position: "fixed", bottom: "2rem", right: "2rem" }}
    onClick={onClick}
  >
    <AddIcon />
  </Fab>
);

export default AddFab;
