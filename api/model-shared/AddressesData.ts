import { z } from "zod";

export const schema = z.array(
  z.object({
    name: z.string(),
    address: z.string(),
  })
);

type AddressesData = z.infer<typeof schema>;

export default AddressesData;
