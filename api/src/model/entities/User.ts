import { z } from "zod";
import Entity from "../interfaces/Entity";
import Validatable from "../interfaces/Validatable";
import dateSchema from "../schemas/date";
import { entity, id, property } from "../../orm/decorators";
import { validateAllProperties } from "../../orm/validations";

const mbSchema = z
  .object({
    accessToken: z
      .object({
        value: z.string(),
        expiresAt: dateSchema,
      })
      .optional(),
    refreshToken: z.string(),
  })
  .optional();

@entity("Users")
export default class User implements Entity, Validatable {
  @id()
  declare id: string;

  @property(mbSchema)
  declare mercedesBenz?: z.infer<typeof mbSchema>;

  @property(z.string().optional())
  declare mercedesBenzNonce?: string;

  @property(z.record(z.string()).optional())
  declare addresses?: Record<string, string>;

  constructor(id?: string) {
    if (id) this.id = id;
  }

  validate(): void {
    validateAllProperties(this);

    if (this.mercedesBenz && this.mercedesBenzNonce)
      throw new Error(
        "Mercedes benz tokens and nonce cannot be set at the same time."
      );
  }
}
