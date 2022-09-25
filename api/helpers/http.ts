import { AzureFunction, HttpRequest, HttpResponse } from "@azure/functions";
import { interfaces } from "inversify";
import container from "../container";

export interface HttpRequestHandler {
  handle(req: HttpRequest): Promise<HttpResponse> | HttpResponse;
}

export const createHttpRequestHandler =
  <Handler extends HttpRequestHandler>(
    type: interfaces.ServiceIdentifier<Handler>,
    allowAnonymous: boolean
  ): AzureFunction =>
  async (context) => {
    try {
      let req = context.req;
      if (!req) throw new Error("Function was not bound as HttpTrigger!");

      if (!req.user && !allowAnonymous) {
        context.res = {
          status: 401,
        } as HttpResponse;
        return;
      }

      context.res = await container.get(type).handle(req);
    } catch (error) {
      context.log.error(error);

      context.res = {
        status: 500,
        body: String(error),
      } as HttpResponse;
    }
  };
