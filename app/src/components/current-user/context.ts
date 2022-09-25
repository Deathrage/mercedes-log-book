import { createContext } from "react";

export interface CurrentUserContext {
  get id(): string;
  get mercedesBenzPaired(): boolean;
}

export default createContext<CurrentUserContext>(
  new Proxy<CurrentUserContext>({} as CurrentUserContext, {
    get: () => {
      throw new Error("Current user context was not initialized!");
    },
  })
);
