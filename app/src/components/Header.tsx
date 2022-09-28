import {
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  IconButton,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { FC } from "react";
import { Menu as MenuIcon } from "@mui/icons-material";
import { drawerWidth } from "./Drawer";
import CurrentUserCard from "./current-user/CurrentUserCard";
import Routes from "../consts/Routes";
import { useLocation } from "react-router-dom";

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
        <CurrentUserCard />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
