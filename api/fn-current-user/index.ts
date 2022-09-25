import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import PublicUserData from "../model-shared/PublicUserData";
import User from "../model/User";
import UserRepository from "../repository/UserRepository";

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
        id: user.id,
        mercedesBenzPaired: !!user.mercedesBenz,
      } as PublicUserData,
    };
  }

  #userRepository: UserRepository;
}

export default createHttpRequestHandler(CurrentUser, false);
