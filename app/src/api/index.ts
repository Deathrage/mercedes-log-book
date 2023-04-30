import { AuthorizeMb } from "@shared/contracts";
import { mercedesBenzError } from "@shared/model";
import { createElement, useCallback, useEffect, useRef, useState } from "react";
import { toApiEndpoint } from "../helpers/api";
import { useErrorsContext } from "../components/errors/hooks";
import endpoints from "./endpoints";
import { Box, Button } from "@mui/material";

export const useLazyApi = <Response, Request = undefined>(
  pick: (list: typeof endpoints) => (request: Request) => Promise<Response>,
  config?: { silent?: boolean; defaultRunning?: boolean }
) => {
  const silent = config?.silent ?? false;
  const defaultRunning = config?.defaultRunning ?? false;

  const { show } = useErrorsContext();

  const endpoint = pick(endpoints);

  const [state, setState] = useState<{
    running: boolean;
    data: Response | null;
    error: unknown | null;
  }>({
    running: defaultRunning,
    data: null,
    error: null,
  });

  const abortHandler = useRef<() => void>();

  const reset = useCallback(() => {
    // Abort ongoing request if reset called
    abortHandler.current?.();
    setState({ running: false, data: null, error: null });
  }, []);

  const invoke = useCallback(
    (request: Request) =>
      new Promise<Response>(async (resolve, reject) => {
        // Abort already ongoing abort it
        abortHandler.current?.();
        abortHandler.current = () => {
          reject();
          abortHandler.current = undefined;
        };

        setState({ running: true, data: null, error: null });
        try {
          const response = (await endpoint(request)) as Response;
          setState({ running: false, data: response, error: null });

          resolve(response);
        } catch (error) {
          setState({ running: false, data: null, error });

          let isMbError = false;

          if (
            error instanceof Error &&
            typeof error.cause === "object" &&
            // null is treated as object
            error.cause
          ) {
            const result = mercedesBenzError.safeParse(error.cause);
            debugger;
            if (result.success) {
              // At this point we can be sure that this is MB error
              isMbError = true;
              if (!silent)
                show(error, {
                  title: "Mercedes Benz API Error",
                  action: createElement(
                    Box,
                    { sx: { marginTop: "1rem" } },
                    createElement(
                      Button,
                      {
                        color: "error",
                        variant: "outlined",
                        onClick: () => {
                          window.location.href = toApiEndpoint(
                            AuthorizeMb.GET_INIT.path
                          );
                        },
                      },
                      "Re-authorize Mercedes Me"
                    )
                  ),
                });
            }
          }

          if (!silent && !isMbError) show(error);
          reject(error);
        }
      }),
    [endpoint, show, silent]
  );

  return { ...state, invoke, reset };
};

export const useApi = <Response, Request = undefined>(
  pick: (list: typeof endpoints) => (request: Request) => Promise<Response>,
  config?: Request extends undefined
    ? { silent?: boolean }
    : { silent?: boolean; request: Request }
) => {
  const { data, error, running, invoke } = useLazyApi<Response, Request>(pick, {
    silent: config?.silent,
    defaultRunning: true,
  });

  const request = config && "request" in config ? config.request : undefined;
  useEffect(() => {
    invoke(request as Request);
  }, [invoke, request]);

  return { data, running, error };
};
