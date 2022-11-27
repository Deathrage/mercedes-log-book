import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { ReactNode, useCallback, useState } from "react";

export const WithConfirm = ({
  text,
  onConfirmed,
  children,
}: {
  text: ReactNode;
  onConfirmed: () => void;
  children: (ask: () => void) => ReactNode;
}) => {
  const [open, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);
  const ask = useCallback(() => setIsOpen(true), []);

  return (
    <>
      {children(ask)}
      <Dialog open={open} onClose={close} fullWidth>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>{text}</DialogContent>
        <DialogActions>
          <Button onClick={close} variant="contained" color="warning">
            Back
          </Button>
          <Button onClick={onConfirmed} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
