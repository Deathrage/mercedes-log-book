import {
  AzureFunction,
  Context,
  HttpRequest,
  HttpResponse,
} from "@azure/functions";
import container from "../container";
import User from "../model/User";
import UserRepository from "../repository/UserRepository";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const { id, username } = context.req!.user!;

  const user = await container
    .get(UserRepository)
    .getOrCreate(id, new User({ id, username }));

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
