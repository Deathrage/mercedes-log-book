import { Context, HttpRequest } from "@azure/functions";
import createHandler from "../helpers/createHandler";

export default createHandler((_: Context, req: HttpRequest) => {
  const userId = req.user?.id;
  if (!userId) throw new Error("UserId?");

  return {
    body: `Hi, you are ${userId}.`,
  };
});
