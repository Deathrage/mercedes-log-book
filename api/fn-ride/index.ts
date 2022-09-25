import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import extend from "just-extend";
import { assertValidRequest, assertVehicleOwner } from "../helpers/assert";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import RideData, { schema as RideDataSchema } from "../model-shared/RideData";
import Ride from "../model/Ride";
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
    assertValidRequest(req, ["GET", "POST", "DELETE"], {
      GET: ["id"],
      DELETE: ["id"],
    });

    if (req.method === "POST")
      return {
        body: await this.#post(
          RideDataSchema.parse(req.body),
          req.user!.username
        ),
      };

    const rideId = req.params.id;
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

    this.#assertAuthorization(ride, userId);

    return RideDataSchema.parse(ride);
  }

  async #delete(rideId: string, userId: string): Promise<RideData> {
    const ride = await this.#repository.getRequired(rideId);

    this.#assertAuthorization(ride, userId);

    const deletedRide = await this.#repository.delete(rideId);
    return RideDataSchema.parse(deletedRide);
  }

  async #post(body: RideData, userId: string): Promise<RideData> {
    let ride = await this.#repository.get(body.id);

    if (ride) this.#assertAuthorization(ride, userId);
    if (!ride) ride = new Ride();

    // Update vehicle from body
    extend(ride, body);

    await this.#repository.createOrUpdate(ride);

    return RideDataSchema.parse(ride);
  }

  async #assertAuthorization(ride: Ride, userId: string) {
    const vehicle = await this.#vehicleRepository.getRequired(ride.vehicleId);
    assertVehicleOwner(vehicle, userId);
  }
}

export default createHttpRequestHandler(RideHandler, false);
