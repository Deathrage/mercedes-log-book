import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import { assertVehicleOwner } from "../helpers/assert";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import RidesRepository from "../repository/RidesRepository";
import VehicleRepository from "../repository/VehicleRepository";
import { schema as RideDataSchema } from "../model-shared/RideData";

@injectable()
class VehicleRideHandler implements HttpRequestHandler {
  constructor(
    vehicleRepository: VehicleRepository,
    rideRepository: RidesRepository
  ) {
    this.#vehicleRepository = vehicleRepository;
    this.#rideRepository = rideRepository;
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const userId = req.user!.username;
    const vehicleId = req.params.id;

    const vehicle = await this.#vehicleRepository.getRequired(
      vehicleId,
      userId
    );

    assertVehicleOwner(vehicle, userId);

    if (!vehicle.onRideId) return {};

    const ride = await this.#rideRepository.getRequired(
      vehicle.onRideId,
      vehicle.id
    );

    return {
      body: RideDataSchema.parse(ride),
    };
  }

  #vehicleRepository: VehicleRepository;
  #rideRepository: RidesRepository;
}

export default createHttpRequestHandler(VehicleRideHandler, false);
