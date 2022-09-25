import { z } from "zod";

export const schema = z.preprocess(
  (arg) =>
    typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined,
  z.date()
);

type Date = z.infer<typeof schema>;

export default Date;
