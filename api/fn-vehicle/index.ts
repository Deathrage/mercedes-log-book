import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import PostVehicleRequest from "../model-contract/vehicle/PostVehicleRequest";
import VehicleResponse from "../model-contract/vehicle/VehicleResponse";
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
    if (!vehicleId && req.method === "GET")
      throw new Error("Parameter id is required if method is GET!");
    if (!body && req.method === "POST")
      throw new Error("Body is required when method is POST!");

    return {
      body:
        req.method === "GET"
          ? await this.#get(vehicleId)
          : await this.#createOrUpdate(
              body as PostVehicleRequest,
              req.user!.username
            ),
    };
  }

  async #get(vehicleId: string): Promise<VehicleResponse> {
    const vehicle = await this.#repository.getRequired(vehicleId);
    return {
      vin: vehicle.id,
      license: vehicle.license,
      model: vehicle.model,
      propulsion: vehicle.propulsion,
    };
  }

  async #createOrUpdate(
    body: PostVehicleRequest,
    userId: string
  ): Promise<VehicleResponse> {
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

    return {
      vin: vehicle.id,
      license: vehicle.license,
      model: vehicle.model,
      propulsion: vehicle.propulsion,
    };
  }

  #repository: VehicleRepository;
}

export default createHttpRequestHandler(VehicleHandler, false);
