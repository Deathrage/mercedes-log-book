import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const userId = req.user?.id;
  if (!userId) throw new Error("UserId?");

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: `Hi, you are ${userId}.`,
  };
};

export default httpTrigger;
