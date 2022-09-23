import entity from "../decorators/entity";
import Entity from "./Entity";
import Validatable from "./Validatable";

@entity("Users")
export default class User implements Entity, Validatable {
  id: string;
  username: string;
  mercedesBenz?: {
    accessToken?: {
      value: string;
      expiresAt: Date;
    };
    refreshToken: string;
  };
  mercedesBenzNonce?: string;

  constructor(entity?: Partial<User>) {
    if (entity) Object.assign(this, entity);
  }

  validate(): void {
    if (this.mercedesBenzNonce && this.mercedesBenz)
      throw new Error(
        "Mercedes benz tokens and nonce cannot be set at the same time."
      );
  }
}
