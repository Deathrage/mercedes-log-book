import { z } from "zod";
import date from "./date";

const withDate = <Type extends z.ZodTypeAny>(inner: Type) =>
  z.object({
    value: inner,
    date,
  });

export default withDate;
