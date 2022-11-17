import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Tooltip,
} from "@mui/material";
import React, { FC, useRef, useState } from "react";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { WithConfirm } from "../../../components/WithConfirm";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RideData from "../../../../../api/model-shared/RideData";
import { formatCoordinates } from "src/helpers/formatters";

export const RideActions: FC<{
  ride: RideData;
  onReturn: () => void;
  onCopy: () => void;
  onEdit: () => void;
  onDelete: () => void;
  loading: boolean;
  onlyEditOrDelete?: boolean;
}> = ({
  ride: { id, address, coordinates },
  onReturn,
  onCopy,
  onEdit,
  onDelete,
  loading,
  onlyEditOrDelete,
}) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const deleteConfirmText = (
    <>
      Are you sure you wanna delete this ride?
      <br />
      <br />
      Id:{id}
      <br />
      From: {address.start ?? formatCoordinates(coordinates.start) ?? "-"}
      <br />
      To: {address.end ?? formatCoordinates(coordinates.end) ?? "-"}
    </>
  );

  return (
    <>
      <ButtonGroup variant="text" color="inherit" ref={anchorRef}>
        {onlyEditOrDelete ? (
          <>
            <Tooltip title="Edit" placement="top">
              <Button onClick={onEdit} disabled={loading}>
                <EditIcon />
              </Button>
            </Tooltip>
            <WithConfirm text={deleteConfirmText} onConfirmed={onDelete}>
              {(ask) => (
                <Tooltip title="Delete" placement="top">
                  <Button onClick={ask} disabled={loading}>
                    <DeleteIcon color="error" />
                  </Button>
                </Tooltip>
              )}
            </WithConfirm>
          </>
        ) : (
          <>
            <Tooltip title="Return ride" placement="top">
              <Button onClick={onReturn} disabled={loading}>
                <KeyboardReturnIcon />
              </Button>
            </Tooltip>
            <Button
              size="small"
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={() => setOpen(true)}
            >
              <ArrowDropDownIcon />
            </Button>
          </>
        )}
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        role={undefined}
        transition
        disablePortal
        anchorEl={anchorRef.current}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <MenuList>
                  <MenuItem onClick={onCopy} disabled={loading}>
                    <ListItemIcon>
                      <ContentCopyIcon />
                    </ListItemIcon>
                    <ListItemText>Copy</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={onEdit} disabled={loading}>
                    <ListItemIcon>
                      <EditIcon />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                  </MenuItem>
                  <WithConfirm text={deleteConfirmText} onConfirmed={onDelete}>
                    {(ask) => (
                      <MenuItem onClick={ask} disabled={loading}>
                        <ListItemIcon>
                          <DeleteIcon color="error" />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                      </MenuItem>
                    )}
                  </WithConfirm>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
