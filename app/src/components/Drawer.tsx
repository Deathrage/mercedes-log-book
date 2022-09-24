import {
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Toolbar,
  ListSubheader,
} from "@mui/material";
import React, { FC } from "react";
import {
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  DirectionsCarFilled as DirectionsCarFilledIcon,
  Route as RouteIcon,
  Flag as FlagIcon,
  FlagOutlined as FlagOutlinedIcon,
} from "@mui/icons-material";
import Routes from "../consts/Routes";
import { useLocation, useNavigate } from "react-router-dom";

export const drawerWidth: number = 240;

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const Drawer: FC<{ open?: boolean; onToggleDrawer?: () => void }> = ({
  open,
  onToggleDrawer,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <StyledDrawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: [1],
        }}
      >
        Log Book
        <IconButton onClick={onToggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        <ListItemButton
          selected={pathname === Routes.DASHBOARD}
          onClick={() => navigate(Routes.DASHBOARD)}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton
          selected={pathname === Routes.VEHICLE}
          onClick={() => navigate(Routes.VEHICLE)}
        >
          <ListItemIcon>
            <DirectionsCarFilledIcon />
          </ListItemIcon>
          <ListItemText primary="Vehicle" />
        </ListItemButton>
        <ListItemButton
          selected={pathname === Routes.RIDES}
          onClick={() => navigate(Routes.RIDES)}
        >
          <ListItemIcon>
            <RouteIcon />
          </ListItemIcon>
          <ListItemText primary="Rides" />
        </ListItemButton>
        <Divider sx={{ my: 1 }} />
        <ListSubheader component="div" inset>
          Ride tracking
        </ListSubheader>
        <ListItemButton>
          <ListItemIcon>
            <FlagOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Begin ride" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <FlagIcon />
          </ListItemIcon>
          <ListItemText primary="Finish ride" />
        </ListItemButton>
      </List>
    </StyledDrawer>
  );
};
export default Drawer;
