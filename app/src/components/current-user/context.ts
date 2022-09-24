import { createContext } from "react";

export interface CurrentUserContext {
  get username(): string;
  get mercedesBenzPaired(): boolean;
}

export default createContext<CurrentUserContext>(
  new Proxy<CurrentUserContext>({} as CurrentUserContext, {
    get: () => {
      throw new Error("Context was not initialized!");
    },
  })
);
