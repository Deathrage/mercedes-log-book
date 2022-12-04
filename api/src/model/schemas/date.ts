import { z } from "zod";

export default z.preprocess(
  (arg) =>
    typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined,
  z.date()
);
