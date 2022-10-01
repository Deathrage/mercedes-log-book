import {
  createTheme,
  PaletteMode,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material";
import React, { FC, PropsWithChildren, useMemo, useState } from "react";
import context, { ThemeContext } from "./context";

const Provider = context.Provider;

const ThemeProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>("dark");

  const ctx = useMemo<ThemeContext>(
    () => ({
      setMode,
      mode,
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <Provider value={ctx}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </Provider>
  );
};

export default ThemeProvider;
