import { useEffect, useRef } from "react";

const useOnMount = (func: () => void | (() => void)) => {
  const doneRef = useRef(false);

  useEffect(() => {
    if (doneRef.current) return;
    doneRef.current = true;

    return func();
  }, [func]);
};

export default useOnMount;
