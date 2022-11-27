import { useContext } from "react";
import context from "./context";

export const useErrorsContext = () => {
  const ctx = useContext(context);
  return ctx;
};
