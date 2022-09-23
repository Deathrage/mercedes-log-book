import { Context, HttpRequest } from "@azure/functions";
import createHandler from "../helpers/createHandler";

export default createHandler((_: Context, req: HttpRequest) => ({
  body: "Hello world!",
}));
