import { useContext } from "react";
import context from "./context";

export const useVehiclesContext = () => {
  const ctx = useContext(context);
  return ctx;
};
