import { injectable } from "inversify";
import { createHttpHandler } from "../src/http";
import HttpHandler from "../src/http/HttpHandler";
import HttpRequest from "../src/http/HttpRequest";
import HttpResponse from "../src/http/HttpResponse";
import User from "../src/model/entities/User";
import UserRepository from "../src/repository/UserRepository";
import { GET } from "./schema";

@injectable()
class CurrentUserHandler extends HttpHandler {
  constructor(userRepository: UserRepository) {
    super();
    this.#userRepository = userRepository;
  }

  async get(req: HttpRequest): Promise<HttpResponse> {
    const user = await this.#userRepository.getOrCreate(
      req.userId.required,
      new User(req.userId.required)
    );

    return {
      body: GET.response.parse({
        id: user.id,
        mercedesBenzPaired: !!user.mercedesBenz,
      }),
    };
  }

  #userRepository: UserRepository;
}

export default createHttpHandler(CurrentUserHandler);
