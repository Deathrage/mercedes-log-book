import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import { PostVehicleRequest, VehicleResponse } from "../contracts";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import Vehicle from "../model/Vehicle";
import VehicleRepository from "../repository/VehicleRepository";

@injectable()
class VehicleHandler implements HttpRequestHandler {
  constructor(repository: VehicleRepository) {
    this.#repository = repository;
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const vehicleId = req.params.id;
    const body = req.body;
    if (!vehicleId && req.method && ["GET", "DELETE"].includes(req.method))
      throw new Error("Parameter id is required if method is GET!");
    if (!body && req.method === "POST")
      throw new Error("Body is required when method is POST!");

    if (req.method === "POST")
      return {
        body: await this.#post(
          PostVehicleRequest.schema.parse(body),
          req.user!.username
        ),
      };
    if (req.method === "DELETE")
      return {
        body: await this.#delete(vehicleId),
      };

    return {
      body: await this.#get(vehicleId),
    };
  }

  async #get(vehicleId: string): Promise<VehicleResponse.Type> {
    const vehicle = await this.#repository.getRequired(vehicleId);
    return this.#map(vehicle);
  }

  async #delete(vehicleId: string): Promise<VehicleResponse.Type> {
    const vehicle = await this.#repository.delete(vehicleId);
    return this.#map(vehicle);
  }

  async #post(
    body: PostVehicleRequest.Type,
    userId: string
  ): Promise<VehicleResponse.Type> {
    let vehicle = await this.#repository.get(body.vin);

    if (!vehicle) vehicle = new Vehicle();
    else if (vehicle.userId !== userId)
      throw new Error(`Vehicle ${body.vin} does not belong to user ${userId}!`);

    vehicle.id = body.vin;
    vehicle.license = body.license;
    vehicle.model = body.model;
    vehicle.propulsion = body.propulsion;
    vehicle.userId = userId;

    await this.#repository.createOrUpdate(vehicle);

    return this.#map(vehicle);
  }

  #repository: VehicleRepository;

  #map(vehicle: Vehicle): VehicleResponse.Type {
    return {
      vin: vehicle.id,
      license: vehicle.license,
      model: vehicle.model,
      propulsion: vehicle.propulsion,
      gasCapacity: vehicle.capacity.gas,
      batteryCapacity: vehicle.capacity.battery,
    };
  }
}

export default createHttpRequestHandler(VehicleHandler, false);
