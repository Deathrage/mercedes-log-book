import { AzureFunction, Context, HttpResponse } from "@azure/functions";

type InlineAzureFunction = (
  context: Context,
  ...args: any[]
) => Promise<HttpResponse> | HttpResponse;

const createHandler =
  (func: AzureFunction | InlineAzureFunction): AzureFunction =>
  async (context, ...args) => {
    try {
      const maybeResponse = await func(context, ...args);
      if (maybeResponse) context.res = maybeResponse;
    } catch (error) {
      context.log.error(error);

      const response: HttpResponse = {
        status: 500,
        body: String(error),
      };

      context.res = response;
    }
  };

export default createHandler;
