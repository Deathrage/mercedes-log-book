import {
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  List,
  styled,
  Toolbar,
  ListSubheader,
  Collapse,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { FC, useState } from "react";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Route as RouteIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import Routes from "../../consts/Routes";
import VehicleSelect from "../VehicleSelect";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SettingsIcon from "@mui/icons-material/Settings";
import Copyright from "../Copyright";
import { RideReportType } from "../RideReportForm/types";
import RideReportForm from "../RideReportForm";
import MenuItem from "./MenuItem";
import LogoutIcon from "@mui/icons-material/Logout";
import { menuWidth } from "./consts";

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
  const [reportType, setReportType] = useState<RideReportType | null>(null);

  return (
    <>
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
            sx={{
              flexGrow: 1,
              "& .MuiCollapse-wrapperInner": { width: "100%" },
            }}
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
          <MenuItem
            action={Routes.NEW_RIDE}
            icon={<AddBoxIcon />}
            title="New ride"
          />
          <Divider sx={{ my: 1 }} />
          <MenuItem action={Routes.RIDES} icon={<RouteIcon />} title="Rides" />
          <MenuItem
            action={Routes.SETTINGS}
            icon={<SettingsIcon />}
            title="Settings"
          />
          <Divider sx={{ my: 1 }} />
          <ListSubheader component="div" inset>
            Reports
          </ListSubheader>
          <MenuItem
            action={() => setReportType(RideReportType.CURRENT_MONTH)}
            icon={<AssignmentIcon />}
            title="Current month"
          />
          <MenuItem
            action={() => setReportType(RideReportType.PREVIOUS_MONTH)}
            icon={<AssignmentIcon />}
            title="Previous month"
          />
          <MenuItem
            action={() => setReportType(RideReportType.CURRENT_YEAR)}
            icon={<AssignmentIcon />}
            title="Current year"
          />
          <MenuItem
            action={() => setReportType(RideReportType.PREVIOUS_YEAR)}
            icon={<AssignmentIcon />}
            title="Previous year"
          />
          <MenuItem
            action={() => setReportType(RideReportType.CUSTOM)}
            icon={<AssignmentIcon />}
            title="Custom"
          />
          <Divider sx={{ my: 1 }} />
          <ListItemButton href="/.auth/logout">
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sign out" />
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
      <Dialog fullWidth open={!!reportType} onClose={() => setReportType(null)}>
        <RideReportForm
          type={reportType ?? RideReportType.CUSTOM}
          disabled={!reportType}
          onClose={() => setReportType(null)}
          wrap={(title, children, { submitting }) => (
            <>
              <DialogTitle>
                Ride report {reportType ? ` - ${title}` : ""}
              </DialogTitle>
              <DialogContent>{children}</DialogContent>
              <DialogActions>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting || !reportType}
                >
                  Generate
                </Button>
              </DialogActions>
            </>
          )}
        />
      </Dialog>
    </>
  );
};
export default Menu;
