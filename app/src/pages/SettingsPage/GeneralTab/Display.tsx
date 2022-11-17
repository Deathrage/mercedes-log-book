import {
  FormControl,
  InputLabel,
  MenuItem,
  PaletteMode,
  Select,
} from "@mui/material";
import React, { useContext } from "react";
import { FC } from "react";
import context from "../../../components/theme/context";

const Display: FC = () => {
  const { mode, setMode } = useContext(context);

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="mode">Mode</InputLabel>
      <Select
        value={mode}
        labelId="mode"
        label="Mode"
        variant="standard"
        onChange={(e) => setMode(e.target.value as PaletteMode)}
      >
        <MenuItem value={"light" as PaletteMode}>Light</MenuItem>
        <MenuItem value={"dark" as PaletteMode}>Dark</MenuItem>
      </Select>
    </FormControl>
  );
};

export default Display;
