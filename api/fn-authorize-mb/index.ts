import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import MercedesOidc from "../services-mercedes/MercedesOidc";

@injectable()
class AuthorizeMercedesBenz implements HttpRequestHandler {
  constructor(oidc: MercedesOidc) {
    this.#oidc = oidc;
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const oidcUrl = await this.#oidc.beginAuthorization(req.user!.username);

    return {
      status: 302,
      headers: {
        Location: oidcUrl,
      },
      body: "Redirecting...",
    };
  }

  #oidc: MercedesOidc;
}

export default createHttpRequestHandler(AuthorizeMercedesBenz, false);