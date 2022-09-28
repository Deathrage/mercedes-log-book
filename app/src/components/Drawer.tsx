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
  DirectionsCarFilled as DirectionsCarFilledIcon,
  Route as RouteIcon,
  Flag as FlagIcon,
  FlagOutlined as FlagOutlinedIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import Routes from "../consts/Routes";
import { useLocation, useNavigate } from "react-router-dom";
import VehicleSelect from "./VehicleSelect";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PolylineIcon from "@mui/icons-material/Polyline";
import GradingIcon from "@mui/icons-material/Grading";

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
        <VehicleSelect />
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
            <PolylineIcon />
          </ListItemIcon>
          <ListItemText primary="Tracked ride" />
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
        <ListItemButton>
          <ListItemIcon>
            <PlayArrowIcon />
          </ListItemIcon>
          <ListItemText primary="Generator" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <GradingIcon />
          </ListItemIcon>
          <ListItemText primary="Templates" />
        </ListItemButton>
        <Divider sx={{ my: 1 }} />
        <ListSubheader component="div" inset>
          Quick exports
        </ListSubheader>
        <ListItemButton>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Current month" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Previous month" />
        </ListItemButton>
      </List>
    </StyledDrawer>
  );
};
export default Drawer;
