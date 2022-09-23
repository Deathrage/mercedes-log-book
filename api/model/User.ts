import entity from "../decorators/entity";
import Entity from "./Entity";

@entity("Users")
export class User implements Entity {
  id: string;
  userName: string;
  mercedesBenz: {
    accessToken: string;
    expiresAt: Date;
    refreshToken: string;
  };
}
