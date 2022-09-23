import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import MercedesOidc from "../services-mercedes/MercedesOidc";

@injectable()
class AuthorizeMercedesBenzCallback implements HttpRequestHandler {
  constructor(oidc: MercedesOidc) {
    this.#oidc = oidc;
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    await this.#oidc.finishAuthorization(req.user!.username, req.url);

    return {
      status: 302,
      headers: {
        Location: "/",
      },
      body: "Redirecting...",
    };
  }

  #oidc: MercedesOidc;
}

export default createHttpRequestHandler(AuthorizeMercedesBenzCallback, false);
