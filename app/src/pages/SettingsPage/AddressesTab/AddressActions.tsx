import { Button, ButtonGroup, Tooltip } from "@mui/material";
import React, { FC } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WithConfirm from "../../../components/WithConfirm";

const AddressActions: FC<{
  name: string;
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ name, disabled, onEdit, onDelete }) => {
  return (
    <ButtonGroup variant="text" color="inherit">
      <Tooltip title="Edit address" placement="top">
        <Button disabled={disabled} onClick={onEdit}>
          <EditIcon />
        </Button>
      </Tooltip>
      <WithConfirm
        text={`Are you sure you wanna delete address ${name}?`}
        onConfirmed={onDelete}
      >
        {(ask) => (
          <Tooltip title="Delete address" placement="top">
            <Button disabled={disabled} color="error" onClick={ask}>
              <DeleteIcon />
            </Button>
          </Tooltip>
        )}
      </WithConfirm>
    </ButtonGroup>
  );
};

export default AddressActions;
