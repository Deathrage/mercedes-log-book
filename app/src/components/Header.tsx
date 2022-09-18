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

const Header: FC<AppBarProps> = ({ open, onToggleDrawer }) => (
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
        variant="h6"
        color="inherit"
        noWrap
        sx={{ flexGrow: 1 }}
      >
        Dashboard
      </Typography>
      {/* <IconButton color="inherit">
        <Badge badgeContent={4} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton> */}
    </Toolbar>
  </AppBar>
);

export default Header;
