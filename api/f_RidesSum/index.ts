import { injectable } from "inversify";
import { assertVehicleOwner } from "../src/helpers/assert";
import { createHttpHandler } from "../src/http";
import HttpHandler from "../src/http/HttpHandler";
import HttpRequest from "../src/http/HttpRequest";
import HttpResponse from "../src/http/HttpResponse";
import RidesRepository from "../src/repository/RidesRepository";
import VehicleRepository from "../src/repository/VehicleRepository";
import { GET } from "./schema";

@injectable()
class RidesTraveledHandler extends HttpHandler {
  constructor(repository: RidesRepository, vRepository: VehicleRepository) {
    super();
    this.#repository = repository;
    this.#vRepository = vRepository;
  }

  async get(req: HttpRequest): Promise<HttpResponse> {
    const vehicleId = req.params.required.vehicleId;
    const userId = req.userId.required;

    const vehicle = await this.#vRepository.getRequired(vehicleId, userId);
    assertVehicleOwner(vehicle, userId);

    const rides = await this.#repository.sumDistance(vehicleId);

    return {
      body: GET.response.parse(rides),
    };
  }

  #repository: RidesRepository;
  #vRepository: VehicleRepository;
}

export default createHttpHandler(RidesTraveledHandler);
