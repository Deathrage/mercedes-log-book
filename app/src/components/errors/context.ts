import { createContext } from "react";

export interface ErrorsContext {
  show(err: unknown): void;
}

export default createContext<ErrorsContext>(
  new Proxy<ErrorsContext>({} as ErrorsContext, {
    get: () => {
      throw new Error("Errors context was not initialized!");
    },
  })
);
