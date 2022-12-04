import { useCallback, useEffect, useState } from "react";
import { useApi, useLazyApi } from "../../../api";

export const useAddresses = () => {
  const [data, setData] = useState<{ name: string; address: string }[]>();

  const { data: initialData } = useApi((_) => _.currentUserAddresses);
  useEffect(() => {
    if (!initialData) return;
    setData(initialData.slice().sort((a, b) => a.name.localeCompare(b.name)));
  }, [initialData]);

  const { invoke: invokeSave, running: saving } = useLazyApi(
    (_) => _.saveCurrentUserAddresses
  );
  const save = useCallback(
    async (addresses: Parameters<typeof invokeSave>[0]) => {
      const newData = await invokeSave(addresses);
      setData(newData.slice().sort((a, b) => a.name.localeCompare(b.name)));
    },
    [invokeSave]
  );

  return { data, save, saving };
};
