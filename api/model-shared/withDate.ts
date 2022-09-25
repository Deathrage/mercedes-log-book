import { z } from "zod";

const withDate = <Type extends z.ZodTypeAny>(inner: Type) =>
  z.object({
    value: inner,
    date: z.preprocess(
      (arg) =>
        typeof arg === "string" || arg instanceof Date
          ? new Date(arg)
          : undefined,
      z.date()
    ),
  });

export default withDate;
