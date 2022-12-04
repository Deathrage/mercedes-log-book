import HttpRequest from "./HttpRequest";
import HttpResponse from "./HttpResponse";

interface HttpMethodHandlers {
  get?(req: HttpRequest): Promise<HttpResponse>;
  post?(req: HttpRequest): Promise<HttpResponse>;
  put?(req: HttpRequest): Promise<HttpResponse>;
  delete?(req: HttpRequest): Promise<HttpResponse>;
}

export default abstract class HttpHandler implements HttpMethodHandlers {
  handle(request: HttpRequest): Promise<HttpResponse> {
    const invocationTarget =
      request.method.toLowerCase() as keyof HttpMethodHandlers;

    if (!this[invocationTarget])
      return Promise.resolve({
        status: 405,
        body: `Handler for ${request.method} is not implemented!`,
      });

    return this[invocationTarget]!(request);
  }

  get?(req: HttpRequest): Promise<HttpResponse>;
  post?(req: HttpRequest): Promise<HttpResponse>;
  put?(req: HttpRequest): Promise<HttpResponse>;
  delete?(req: HttpRequest): Promise<HttpResponse>;
}
