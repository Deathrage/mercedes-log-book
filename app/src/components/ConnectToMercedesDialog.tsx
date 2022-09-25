import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { FC } from "react";
import api from "../consts/api";
import { useCurrentUserContext } from "./current-user/hooks";

const ConnectToMercedesDialog: FC = () => {
  const { mercedesBenzPaired } = useCurrentUserContext();

  return (
    <Dialog open={!mercedesBenzPaired}>
      <DialogTitle>Connect to Mercedes Benz</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Mercedes Log Book required access to your Mercedes Benz Me account.
          Please sign in with your Mercedes Benz Me credentials to authorize
          this application.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button href={api.mercedesAuth}>Authorize</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectToMercedesDialog;
