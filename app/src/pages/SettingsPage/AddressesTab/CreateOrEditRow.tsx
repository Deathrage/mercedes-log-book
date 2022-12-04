import {
  Box,
  Button,
  ButtonGroup,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
} from "@mui/material";
import React, { FC } from "react";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { Form } from "react-final-form";
import TextInputField from "src/components/fields/TextInputField";

interface FormState {
  name: string;
  address: string;
}

const CreateOrEditRow: FC<{
  initialValues?: { name: string; address: string };
  disabled: boolean;
  onSave: (name: string, address: string) => void;
  onCancel: () => void;
}> = ({ initialValues, disabled, onSave, onCancel }) => {
  return (
    <TableRow>
      <TableCell colSpan={3} padding="none">
        <Form<FormState>
          onSubmit={(values, api) => {
            if (api.getState().pristine) {
              onCancel();
              return;
            }
            onSave(values.name, values.address);
          }}
          initialValues={initialValues}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Stack direction="row">
                <Box sx={{ width: "20%", padding: "1rem" }}>
                  <TextInputField
                    name="name"
                    required
                    sx={{ "& input": { paddingTop: "0.5rem" } }}
                    disabled={!!initialValues}
                  />
                </Box>
                <Box sx={{ flexGrow: 1, padding: "1rem" }}>
                  <TextInputField
                    name="address"
                    required
                    sx={{ "& input": { paddingTop: "0.5rem" } }}
                  />
                </Box>
                <Box sx={{ width: "8rem", padding: "1rem" }}>
                  <ButtonGroup variant="text" color="inherit">
                    <Tooltip title="Save address" placement="top">
                      <Button disabled={disabled} type="submit">
                        <SaveIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Cancel" placement="top">
                      <Button
                        disabled={disabled}
                        color="error"
                        onClick={onCancel}
                      >
                        <CloseIcon />
                      </Button>
                    </Tooltip>
                  </ButtonGroup>
                </Box>
              </Stack>
            </form>
          )}
        </Form>
      </TableCell>
    </TableRow>
  );
};
export default CreateOrEditRow;
