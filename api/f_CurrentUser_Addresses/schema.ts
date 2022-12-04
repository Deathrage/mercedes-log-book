import { z } from "zod";

export const GET = {
  path: "current-user/addresses",
  response: z.array(
    z.object({
      name: z.string(),
      address: z.string(),
    })
  ),
};

export const PUT = {
  path: GET.path,
  request: GET.response,
  response: GET.response,
};
