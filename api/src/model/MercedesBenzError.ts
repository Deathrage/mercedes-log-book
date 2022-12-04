import { z } from "zod";
import MercedesBenzErrorType from "./MercedesBenzErrorType";
import mercedesBenzError from "./schemas/mercedesBenzError";

export default class MercedesBenzError
  extends Error
  implements z.infer<typeof mercedesBenzError>
{
  type: MercedesBenzErrorType;

  constructor(type: MercedesBenzErrorType, cause: Error) {
    super(cause.message, { cause });
    this.type = type;
    this.name = "MercedesBenzError";
  }
}
