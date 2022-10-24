import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import AddressesData, {
  schema as AddressesDataSchema,
} from "../model-shared/AddressesData";
import UserRepository from "../repository/UserRepository";

@injectable()
class CurrentUserAddressesHandler implements HttpRequestHandler {
  constructor(repository: UserRepository) {
    this.#repository = repository;
  }

  async handle({ user, body, method }: HttpRequest): Promise<HttpResponse> {
    const userId = user!.username;

    if (method === "POST")
      return {
        body: await this.#post(userId, AddressesDataSchema.parse(body)),
      };

    return {
      body: await this.#get(userId),
    };
  }

  async #get(userId: string): Promise<AddressesData> {
    const user = await this.#repository.get(userId);
    return user.addresses ?? [];
  }

  async #post(
    userId: string,
    addresses: AddressesData
  ): Promise<AddressesData> {
    const user = await this.#repository.get(userId);
    user.addresses = addresses;
    await this.#repository.createOrUpdate(user);
    return addresses;
  }

  #repository: UserRepository;
}

export default createHttpRequestHandler(CurrentUserAddressesHandler, false);
