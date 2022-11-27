import { useCallback, useState } from "react";

export const usePersistedState = (
  key: string,
  initialValue?: string | null
) => {
  const [value, setValue] = useState(localStorage.getItem(key) ?? initialValue);

  const setState = useCallback(
    (value: string | null | undefined) => {
      if (!value) localStorage.removeItem(key);
      else localStorage.setItem(key, value);

      setValue(value);
    },
    [key]
  );

  return [value, setState] as [
    string,
    (value: string | null | undefined) => void
  ];
};
