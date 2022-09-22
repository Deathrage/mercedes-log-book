import {
  AzureFunction,
  Context,
  HttpRequest,
  HttpResponse,
} from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const nonce = req.query["nonce"];
  if (!nonce) throw new Error("Nonce was not specified!");

  const response: HttpResponse = {
    status: 302,
    headers: {
      location: `${process.env.MERCEDES_BENZ_AUTH_URL}&state=${nonce}`,
    },
  };

  context.res = response;
};

export default httpTrigger;
