import { useContext } from "react";
import context from "./context";

export const useCurrentUserContext = () => {
  const ctx = useContext(context);
  return ctx;
};
