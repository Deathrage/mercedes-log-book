import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
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
      GET: ["id", "vehicleId"],
      DELETE: ["id", "vehicleId"],
    });

    if (req.method === "POST")
      return {
        body: await this.#post(
          RideDataSchema.parse(req.body),
          req.user!.username
        ),
      };

    const vehicleId = req.params.vehicleId;
    const rideId = req.params.id;
    if (req.method === "DELETE")
      return {
        body: await this.#delete(rideId, vehicleId, req.user!.username),
      };

    return {
      body: await this.#get(rideId, vehicleId, req.user!.username),
    };
  }

  #repository: RidesRepository;
  #vehicleRepository: VehicleRepository;

  async #get(
    rideId: string,
    vehicleId: string,
    userId: string
  ): Promise<RideData> {
    const ride = await this.#repository.getRequired(rideId, vehicleId);

    await this.#assertAuthorization(ride, userId);

    return RideDataSchema.parse(ride);
  }

  async #delete(
    rideId: string,
    vehicleId: string,
    userId: string
  ): Promise<void> {
    const ride = await this.#repository.getRequired(rideId, vehicleId);

    await this.#assertAuthorization(ride, userId);

    await this.#repository.delete(rideId, vehicleId);
  }

  async #post(body: RideData, userId: string): Promise<RideData> {
    let ride = body.id
      ? await this.#repository.get(body.id, body.vehicleId)
      : null;
    if (ride) {
      this.#assertVehicleNotChanged(ride, body);
      await this.#assertAuthorization(ride, userId);
    }

    ride = new Ride(body);

    await this.#repository.createOrUpdate(ride);

    return RideDataSchema.parse(ride);
  }

  async #assertAuthorization(ride: Ride, userId: string) {
    const vehicle = await this.#vehicleRepository.getRequired(
      ride.vehicleId,
      userId
    );
    assertVehicleOwner(vehicle, userId);
    if (vehicle.onRideId === ride.id)
      throw new Error(
        `Ride ${ride.id} is currently tracked by vehicle ${vehicle.id}. Use vehicle API to access it!`
      );
  }

  async #assertVehicleNotChanged(current: RideData, incoming: RideData) {
    if (current.vehicleId != incoming.vehicleId)
      throw new Error(
        `Cannot change vehicle from ${current.vehicleId} to ${incoming.vehicleId}!`
      );
  }
}

export default createHttpRequestHandler(RideHandler, false);
