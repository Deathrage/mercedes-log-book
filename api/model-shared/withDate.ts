import { z } from "zod";
import { schema as date } from "./Date";

const withDate = <Type extends z.ZodTypeAny>(inner: Type) =>
  z.object({
    value: inner,
    date,
  });

export default withDate;
