import { HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";

@injectable()
class HelloWorld implements HttpRequestHandler {
  handle(): HttpResponse {
    return {
      body: "Hello world!",
    };
  }
}

export default createHttpRequestHandler(HelloWorld, true);
