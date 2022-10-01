import {
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  Box,
  IconButton,
  MenuItem,
  PaletteMode,
  Select,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { FC, useContext } from "react";
import { Menu as MenuIcon } from "@mui/icons-material";
import { drawerWidth } from "./Drawer";
import CurrentUserCard from "./currentUser/CurrentUserCard";
import Routes from "../consts/Routes";
import { useLocation } from "react-router-dom";
import context from "./theme/context";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
  onToggleDrawer?: () => void;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const titles: Record<string, string> = {
  [Routes.TRACKED_RIDE]: "Tracked ride",
  [Routes.RIDES]: "Rides",
  [Routes.VEHICLE]: "Vehicle",
};

const Header: FC<AppBarProps> = ({ open, onToggleDrawer }) => {
  const { mode, setMode } = useContext(context);

  const { pathname } = useLocation();
  const title = titles[pathname];

  return (
    <AppBar position="absolute" open={open}>
      <Toolbar
        sx={{
          pr: "24px",
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={onToggleDrawer}
          sx={{
            marginRight: "36px",
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h5"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          {title}
        </Typography>
        <Box sx={{ marginRight: "1rem" }}>
          <Select
            value={mode}
            onChange={(e) => setMode(e.target.value as PaletteMode)}
            sx={{
              border: "none",
              color: "white",
              "& svg": { color: "white" },
              "& fieldset": { border: "none" },
            }}
          >
            <MenuItem value={"light" as PaletteMode}>Light</MenuItem>
            <MenuItem value={"dark" as PaletteMode}>Dark</MenuItem>
          </Select>
        </Box>

        <CurrentUserCard />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
