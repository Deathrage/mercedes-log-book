import React, { FC, PropsWithChildren, useMemo } from "react";
import { useLazyApi } from "../../api";
import useOnMount from "../../hooks/useOnMount";
import context, { CurrentUserContext } from "./context";

const Provider = context.Provider;

const CurrentUserProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { data, invoke } = useLazyApi((_) => _.currentUser);
  useOnMount(() => {
    invoke(undefined);
  });

  const ctx = useMemo<CurrentUserContext | null>(
    () =>
      data
        ? {
            id: data.id,
            mercedesBenzPaired: data.mercedesBenzPaired,
          }
        : null,
    [data]
  );

  if (ctx) return <Provider value={ctx}>{children}</Provider>;

  return <>Loading...</>;
};

export default CurrentUserProvider;
