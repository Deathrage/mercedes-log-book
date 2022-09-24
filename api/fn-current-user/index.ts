import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import User from "../model/User";
import UserRepository from "../repository/UserRepository";
import { UserResponse } from "../contracts";

@injectable()
class CurrentUser implements HttpRequestHandler {
  constructor(userRepository: UserRepository) {
    this.#userRepository = userRepository;
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const username = req.user!.username;
    const user = await this.#userRepository.getOrCreate(
      username,
      new User({ id: username })
    );

    return {
      body: {
        username: user.id,
        mercedesBenzPaired: !!user.mercedesBenz,
      } as UserResponse.Type,
    };
  }

  #userRepository: UserRepository;
}

export default createHttpRequestHandler(CurrentUser, false);
