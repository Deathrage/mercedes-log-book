import { Alert, AlertTitle, Dialog } from "@mui/material";
import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from "react";
import context, { ErrorsContext } from "./context";

const Provider = context.Provider;

const ErrorsProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [errors, setErrors] = useState<unknown[]>([]);

  const show = useCallback(
    (err: unknown) => setErrors((prev) => [err, ...prev]),
    []
  );

  const ctx = useMemo<ErrorsContext>(
    () => ({
      show,
    }),
    [show]
  );
  const close = useCallback(() => setErrors((prev) => prev.slice(1)), []);

  return (
    <Provider value={ctx}>
      {children}
      <Dialog open={!!errors.length} onClose={close} fullWidth>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {Array.isArray(errors[0])
            ? JSON.stringify(errors[0], null, 2)
            : String(errors[0])}
        </Alert>
      </Dialog>
    </Provider>
  );
};

export default ErrorsProvider;
