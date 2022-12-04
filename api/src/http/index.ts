import container from "../../container";
import {
  AzureFunction,
  HttpRequest as AzureHttpRequest,
  HttpResponse,
} from "@azure/functions";
import { interfaces } from "inversify";
import HttpHandler from "./HttpHandler";
import HttpRequest from "./HttpRequest";
import MercedesBenzError from "../model/MercedesBenzError";

function assertHttpRequest(
  req: AzureHttpRequest | null | undefined
): asserts req is AzureHttpRequest {
  if (!req) throw new Error("Function was not bound as HttpTrigger!");
}

export const createAnonymousHttpHandler =
  <Handler extends HttpHandler>(
    type: interfaces.ServiceIdentifier<Handler>
  ): AzureFunction =>
  async (context) => {
    try {
      assertHttpRequest(context.req);

      context.res = await container
        .get(type)
        .handle(new HttpRequest(context.req));
    } catch (error) {
      context.log.error(error);

      if (error instanceof MercedesBenzError) {
        context.res = {
          status: 500,
          body: {
            type: error.type,
            message: error.message,
          },
        } as HttpResponse;
        return;
      }

      context.res = {
        status: 500,
        body: String(error),
      } as HttpResponse;
    }
  };

export const createHttpHandler = <Handler extends HttpHandler>(
  type: interfaces.ServiceIdentifier<Handler>
): AzureFunction => {
  const handler = createAnonymousHttpHandler(type);
  return (context) => {
    assertHttpRequest(context.req);

    if (!context.req.user) {
      context.res = {
        status: 401,
      } as HttpResponse;
      return;
    }

    return handler(context);
  };
};
