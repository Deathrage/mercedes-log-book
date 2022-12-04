import { z } from "zod";

export default <Type extends z.ZodTypeAny>(type: Type) =>
  z.object({ start: type, end: type });
