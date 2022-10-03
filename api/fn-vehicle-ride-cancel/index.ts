import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import { assertVehicleOwner } from "../helpers/assert";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import RidesRepository from "../repository/RidesRepository";
import VehicleRepository from "../repository/VehicleRepository";

@injectable()
class CancelRideHandler implements HttpRequestHandler {
  constructor(
    rideRepository: RidesRepository,
    vehicleRepository: VehicleRepository
  ) {
    this.#rideRepository = rideRepository;
    this.#vehicleRepository = vehicleRepository;
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const userId = req.user!.username;
    const vehicleId = req.params.id;

    const vehicle = await this.#vehicleRepository.getRequired(
      vehicleId,
      userId
    );

    assertVehicleOwner(vehicle, userId);

    if (!vehicle.onRideId)
      throw new Error(
        `Vehicle ${vehicle.id} is not on a ride. Start the ride first!`
      );

    await this.#rideRepository.delete(vehicle.onRideId, vehicle.id);

    vehicle.onRideId = undefined;
    await this.#vehicleRepository.createOrUpdate(vehicle);

    return {};
  }

  #rideRepository: RidesRepository;
  #vehicleRepository: VehicleRepository;
}

export default createHttpRequestHandler(CancelRideHandler, false);
