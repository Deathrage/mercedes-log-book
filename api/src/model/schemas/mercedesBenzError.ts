import { z } from "zod";
import MercedesBenzErrorType from "../MercedesBenzErrorType";

export default z.object({
  message: z.string(),
  type: z.nativeEnum(MercedesBenzErrorType),
});
