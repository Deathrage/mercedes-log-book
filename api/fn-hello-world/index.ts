import { AzureFunction, Context, HttpResponse } from "@azure/functions";
import { tryBootstrap } from "../bootstrap";

tryBootstrap();

const httpTrigger: AzureFunction = async function (
  context: Context
): Promise<void> {
  const res: HttpResponse = {
    body: "Hello world!",
  };

  context.res = res;
};

export default httpTrigger;
