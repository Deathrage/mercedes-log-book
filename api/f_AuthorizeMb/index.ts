import { injectable } from "inversify";
import { createHttpHandler } from "../src/http";
import HttpHandler from "../src/http/HttpHandler";
import HttpRequest from "../src/http/HttpRequest";
import HttpResponse from "../src/http/HttpResponse";
import MercedesOidc from "../src/services/mercedes/MercedesOidc";

@injectable()
class AuthorizeMercedesBenz extends HttpHandler {
  constructor(oidc: MercedesOidc) {
    super();
    this.#oidc = oidc;
  }

  async get(req: HttpRequest): Promise<HttpResponse> {
    const operation = req.params.optional.operation;

    if (operation) {
      if (operation !== "callback")
        throw new Error(
          "Specify either operation as callback or do not specify at all!"
        );

      return await this.#awaitAndRedirect(
        this.#oidc.finishAuthorization(req.userId.required, req.url)
      );
    }

    return await this.#awaitAndRedirect(
      this.#oidc.beginAuthorization(req.userId.required)
    );
  }

  async #awaitAndRedirect(
    promise: Promise<string | void>
  ): Promise<HttpResponse> {
    const newLocation = await promise;

    return {
      status: 302,
      headers: {
        Location: newLocation ?? "/",
      },
      body: "Redirecting...",
    };
  }

  #oidc: MercedesOidc;
}

export default createHttpHandler(AuthorizeMercedesBenz);
