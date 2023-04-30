import { Alert, AlertTitle, Dialog } from "@mui/material";
import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from "react";
import context, { ErrorsContext } from "./context";

type Params = Parameters<ErrorsContext["show"]>;
type QueuedError = {
  err: Params[0];
} & Params[1];

const Provider = context.Provider;

const ActiveError: FC<QueuedError & { onClose: () => void }> = ({
  err,
  title,
  action,
  onClose,
}) => (
  <Alert severity="error" onClose={onClose}>
    <AlertTitle>{title ?? "Error"}</AlertTitle>
    {Array.isArray(err) ? JSON.stringify(err, null, 2) : String(err)}
    {action}
  </Alert>
);

const ErrorsProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [errors, setErrors] = useState<QueuedError[]>([]);

  const show = useCallback<ErrorsContext["show"]>(
    (err, opts) =>
      setErrors((prev) => [
        {
          err,
          ...opts,
        },
        ...prev,
      ]),
    []
  );

  const ctx = useMemo<ErrorsContext>(
    () => ({
      show,
    }),
    [show]
  );
  const close = useCallback(() => setErrors((prev) => prev.slice(1)), []);

  const activeError = errors[0];
  return (
    <Provider value={ctx}>
      {children}
      <Dialog open={!!activeError} onClose={close} fullWidth>
        <ActiveError {...activeError} onClose={close} />
      </Dialog>
    </Provider>
  );
};

export default ErrorsProvider;
