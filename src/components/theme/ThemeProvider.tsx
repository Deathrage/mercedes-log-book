import {
  createTheme,
  PaletteMode,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material";
import React, { FC, PropsWithChildren, useCallback, useMemo } from "react";
import { usePersistedState } from "src/hooks/usePersistedState";
import context, { ThemeContext } from "./context";

const Provider = context.Provider;

const ThemeProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const preferDark = useMemo(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    []
  );

  const [mode, setMode] = usePersistedState(
    "mode",
    preferDark ? "dark" : "light"
  );

  const typedSetMode = useCallback(
    (mode: PaletteMode) => setMode(mode),
    [setMode]
  );

  const ctx = useMemo<ThemeContext>(
    () => ({
      setMode: typedSetMode,
      mode: mode as PaletteMode,
    }),
    [mode, typedSetMode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode as PaletteMode,
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
