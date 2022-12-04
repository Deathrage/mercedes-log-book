import { injectable } from "inversify";
import { toObject } from "../src/helpers/object";
import { createHttpHandler } from "../src/http";
import HttpHandler from "../src/http/HttpHandler";
import HttpRequest from "../src/http/HttpRequest";
import HttpResponse from "../src/http/HttpResponse";
import UserRepository from "../src/repository/UserRepository";
import { GET, PUT } from "./schema";

@injectable()
class CurrentUserAddressesHandler extends HttpHandler {
  constructor(repository: UserRepository) {
    super();
    this.#repository = repository;
  }

  async get(req: HttpRequest): Promise<HttpResponse> {
    const user = await this.#repository.get(req.userId.required);
    return {
      body: user.addresses
        ? GET.response.parse(this.#toArray(user.addresses))
        : [],
    };
  }

  async put(req: HttpRequest): Promise<HttpResponse> {
    const user = await this.#repository.get(req.userId.required);

    const addresses = PUT.request.parse(req.body);

    user.addresses = toObject(
      addresses,
      (a) => a.name,
      (a) => a.address
    );

    await this.#repository.createOrUpdate(user);

    return {
      body: PUT.response.parse(this.#toArray(user.addresses)),
    };
  }

  #repository: UserRepository;

  #toArray(addresses: Record<string, string>) {
    const asArray = Object.entries(addresses).map(([name, address]) => ({
      name,
      address,
    }));
    return asArray;
  }
}

export default createHttpHandler(CurrentUserAddressesHandler);
