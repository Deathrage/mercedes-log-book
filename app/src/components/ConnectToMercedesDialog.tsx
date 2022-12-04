import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { AuthorizeMb } from "@shared/contracts";
import React, { FC } from "react";
import { toApiEndpoint } from "src/helpers/api";
import { useCurrentUserContext } from "./currentUser/hooks";

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
        <Button href={toApiEndpoint(AuthorizeMb.GET_INIT.path)}>
          Authorize
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectToMercedesDialog;
