import { z } from "zod";
import entity from "../decorators/entity";
import Entity from "./Entity";
import Validatable from "./Validatable";
import extend from "just-extend";
import { schema as date } from "../model-shared/Date";

const schema = z
  .object({
    id: z.string(),
    mercedesBenz: z
      .object({
        accessToken: z
          .object({
            value: z.string(),
            expiresAt: date,
          })
          .optional(),
        refreshToken: z.string(),
      })
      .optional(),
    mercedesBenzNonce: z.string().optional(),
    addresses: z.array(z.string()).optional(),
  })
  .refine(
    (data) => !(data.mercedesBenz && data.mercedesBenzNonce),
    "Mercedes benz tokens and nonce cannot be set at the same time."
  );

type UserData = z.infer<typeof schema>;

@entity("Users")
export default class User implements Entity, Validatable, UserData {
  id: string;
  mercedesBenz?: {
    accessToken?: {
      value: string;
      expiresAt: Date;
    };
    refreshToken: string;
  };
  mercedesBenzNonce?: string;
  addresses?: string[];

  constructor(data?: UserData) {
    if (data) extend(this, schema.parse(data));
  }

  validate(): void {
    schema.parse(this);
  }
}
