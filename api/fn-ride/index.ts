import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import extend from "just-extend";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import RideData, { schema as RideDataSchema } from "../model-shared/RideData";
import Ride from "../model/Ride";
import Vehicle from "../model/Vehicle";
import RidesRepository from "../repository/RidesRepository";
import VehicleRepository from "../repository/VehicleRepository";

@injectable()
class RideHandler implements HttpRequestHandler {
  constructor(
    repository: RidesRepository,
    vehicleRepository: VehicleRepository
  ) {
    this.#repository = repository;
    this.#vehicleRepository = vehicleRepository;
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const rideId = req.params.id;
    const body = req.body;
    if (!rideId && req.method && ["GET", "DELETE"].includes(req.method))
      throw new Error("Parameter id is required if method is GET!");
    if (!body && req.method === "POST")
      throw new Error("Body is required when method is POST!");

    if (req.method === "POST")
      return {
        body: await this.#post(RideDataSchema.parse(body), req.user!.username),
      };
    if (req.method === "DELETE")
      return {
        body: await this.#delete(rideId, req.user!.username),
      };

    return {
      body: await this.#get(rideId, req.user!.username),
    };
  }

  #repository: RidesRepository;
  #vehicleRepository: VehicleRepository;

  async #get(rideId: string, userId: string): Promise<RideData> {
    const ride = await this.#repository.getRequired(rideId);
    const vehicle = await this.#vehicleRepository.getRequired(ride.vehicleId);
    this.#assertVehicleOwned(vehicle, userId);

    return RideDataSchema.parse(vehicle);
  }

  async #delete(rideId: string, userId: string): Promise<RideData> {
    const ride = await this.#repository.getRequired(rideId);
    const vehicle = await this.#vehicleRepository.getRequired(ride.vehicleId);
    this.#assertVehicleOwned(vehicle, userId);

    const deletedVehicle = await this.#repository.delete(rideId);
    return RideDataSchema.parse(deletedVehicle);
  }

  async #post(body: RideData, userId: string): Promise<RideData> {
    let ride = await this.#repository.get(body.id);

    if (ride) {
      const vehicle = await this.#vehicleRepository.getRequired(ride.vehicleId);
      this.#assertVehicleOwned(vehicle, userId);
    }
    if (!ride) {
      ride = new Ride();
    }

    // Update vehicle from body
    extend(ride, body);

    await this.#repository.createOrUpdate(ride);

    return RideDataSchema.parse(ride);
  }

  async #assertVehicleOwned(vehicle: Vehicle, userId: string) {
    if (vehicle.userId !== userId)
      throw new Error(
        `Vehicle ${vehicle.id} does not belong to user ${userId}!`
      );
  }
}

export default createHttpRequestHandler(RideHandler, false);
