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
  Collapse,
  Box,
} from "@mui/material";
import React, { FC } from "react";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Route as RouteIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import Routes from "../consts/Routes";
import { useLocation, useNavigate } from "react-router-dom";
import VehicleSelect from "./VehicleSelect";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SettingsIcon from "@mui/icons-material/Settings";
import Copyright from "./Copyright";

export const menuWidth: number = 240;

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: menuWidth,
    overflow: "hidden",
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
      width: theme.spacing(8),
    }),
  },
}));

const Menu: FC<{ open?: boolean; onToggleDrawer?: () => void }> = ({
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
        <Collapse
          orientation="horizontal"
          in={open}
          sx={{ flexGrow: 1, "& .MuiCollapse-wrapperInner": { width: "100%" } }}
        >
          <VehicleSelect />
        </Collapse>
        <IconButton
          onClick={onToggleDrawer}
          sx={{ mr: open ? undefined : "1rem" }}
        >
          {open && <ChevronLeftIcon />}
          {!open && <ChevronRightIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        <ListItemButton
          selected={pathname === Routes.NEW_RIDE}
          onClick={() => navigate(Routes.NEW_RIDE)}
        >
          <ListItemIcon>
            <AddBoxIcon />
          </ListItemIcon>
          <ListItemText primary="New ride" />
        </ListItemButton>
        <Divider sx={{ my: 1 }} />
        <ListItemButton
          selected={pathname === Routes.RIDES}
          onClick={() => navigate(Routes.RIDES)}
        >
          <ListItemIcon>
            <RouteIcon />
          </ListItemIcon>
          <ListItemText primary="Rides" />
        </ListItemButton>
        <ListItemButton
          selected={pathname === Routes.SETTINGS}
          onClick={() => navigate(Routes.SETTINGS)}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
        <Divider sx={{ my: 1 }} />
        <ListSubheader component="div" inset>
          Reports
        </ListSubheader>
        <ListItemButton disabled>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Current month" />
        </ListItemButton>
        <ListItemButton disabled>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Previous month" />
        </ListItemButton>
        <ListItemButton disabled>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Custom" />
        </ListItemButton>
      </List>
      <Box
        sx={{
          position: "absolute",
          bottom: "1rem",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Collapse orientation="horizontal" in={open}>
          <Copyright sx={{ paddingLeft: "1.5rem" }} />
        </Collapse>
      </Box>
    </StyledDrawer>
  );
};
export default Menu;
