import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import { VehiclesResponse } from "../contracts";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import Vehicle from "../model/Vehicle";
import VehicleRepository from "../repository/VehicleRepository";

@injectable()
class VehiclesHandler implements HttpRequestHandler {
  constructor(repository: VehicleRepository) {
    this.#repository = repository;
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const userId = req.user!.username;
    const vehicles = await this.#repository.getAll(userId);
    return {
      body: this.#map(vehicles),
    };
  }

  #repository: VehicleRepository;

  #map(vehicles: Vehicle[]): VehiclesResponse.Type {
    return {
      vehicles: vehicles.map((vehicle) => ({
        vin: vehicle.id,
        license: vehicle.license,
        model: vehicle.model,
        propulsion: vehicle.propulsion,
        gasCapacity: vehicle.capacity.gas,
        batteryCapacity: vehicle.capacity.battery,
      })),
      count: vehicles.length,
    };
  }
}

export default createHttpRequestHandler(VehiclesHandler, false);
