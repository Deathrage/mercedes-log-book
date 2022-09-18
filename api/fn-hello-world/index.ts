import { AzureFunction, Context, HttpResponse } from "@azure/functions";
import { bootstrap } from "../bootstrap";

bootstrap();

const httpTrigger: AzureFunction = async function (
  context: Context
): Promise<void> {
  const res: HttpResponse = {
    body: "Hello world!",
  };

  context.res = res;
};

export default httpTrigger;
