import { z } from "zod";

export enum MercedesBenzErrorType {
  INVALID_GRANT = "INVALID_GRANT",
  OTHER = "OTHER",
}

export const schema = z.object({
  message: z.string(),
  type: z.nativeEnum(MercedesBenzErrorType),
});

type MercedesBenzErrorData = z.infer<typeof schema>;

export default MercedesBenzErrorData;
