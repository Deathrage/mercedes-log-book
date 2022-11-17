import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import RidesData from "../model-shared/RidesData";
import RidesRepository from "../repository/RidesRepository";
import VehicleRepository from "../repository/VehicleRepository";

@injectable()
class RidesHandler implements HttpRequestHandler {
  constructor(
    repository: RidesRepository,
    vehicleRepository: VehicleRepository
  ) {
    this.#repository = repository;
    this.#vehicleRepository = vehicleRepository;
  }

  async handle({ params, query, user }: HttpRequest): Promise<HttpResponse> {
    const userId = user!.username;
    const vehicleId = params.vehicleId;
    const page = Number(query.page);
    const pageSize = Number(query.pageSize);

    if (isNaN(page)) throw new Error("Page is not a number!");
    if (pageSize > 10) throw new Error("Page size has to be at most 10!");

    return {
      body: await this.#get(vehicleId, userId, page, pageSize),
    };
  }

  async #get(
    vehicleId: string,
    userId: string,
    page: number,
    pageSize: number
  ): Promise<RidesData> {
    const vehicle = await this.#vehicleRepository.getRequired(
      vehicleId,
      userId
    );
    if (vehicle.userId !== userId)
      throw new Error(`Vehicle ${vehicleId} is not owned by user ${userId}!`);

    const rides = await this.#repository.paginatedFromLatest(
      vehicleId,
      pageSize * page,
      pageSize + 1
    );
    const hasMore = rides.length > pageSize;

    return {
      hasMore,
      rides: rides.slice(0, pageSize),
    };
  }

  #vehicleRepository: VehicleRepository;
  #repository: RidesRepository;
}

export default createHttpRequestHandler(RidesHandler, false);
