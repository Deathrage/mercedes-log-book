import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import RidesRepository from "../repository/RidesRepository";

@injectable()
class RidesTraveledHandler implements HttpRequestHandler {
  constructor(repository: RidesRepository) {
    this.#repository = repository;
  }

  async handle({ user, params }: HttpRequest): Promise<HttpResponse> {
    const vehicleId = params.vehicleId;
    const userId = user!.username;

    const rides = await this.#repository.sumDistance(vehicleId);

    return {
      body: rides,
    };
  }

  #repository: RidesRepository;
}

export default createHttpRequestHandler(RidesTraveledHandler, false);
