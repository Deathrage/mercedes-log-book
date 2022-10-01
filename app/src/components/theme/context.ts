import { PaletteMode } from "@mui/material";
import { createContext } from "react";

export interface ThemeContext {
  mode: PaletteMode;
  setMode: (mode: PaletteMode) => void;
}

export default createContext<ThemeContext>(
  new Proxy<ThemeContext>({} as ThemeContext, {
    get: () => {
      throw new Error("Theme context was not initialized!");
    },
  })
);
