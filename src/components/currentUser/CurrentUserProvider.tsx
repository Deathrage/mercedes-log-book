import React, { FC, PropsWithChildren, useMemo } from "react";
import { useApi } from "../../api";
import useOnMount from "../../hooks/useOnMount";
import context, { CurrentUserContext } from "./context";

const Provider = context.Provider;

const CurrentUserProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { data, invoke } = useApi((_) => _.getCurrentUser);
  useOnMount(() => {
    invoke(null);
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
