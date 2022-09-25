import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import extend from "just-extend";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import VehicleData, {
  schema as VehicleDataSchema,
} from "../model-shared/VehicleData";
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
          VehicleDataSchema.parse(body),
          req.user!.username
        ),
      };
    if (req.method === "DELETE")
      return {
        body: await this.#delete(vehicleId, req.user!.username),
      };

    return {
      body: await this.#get(vehicleId, req.user!.username),
    };
  }

  #repository: VehicleRepository;

  async #get(vehicleId: string, userId: string): Promise<VehicleData> {
    const vehicle = await this.#repository.getRequired(vehicleId);
    this.#assertVehicleOwned(vehicle, userId);
    return VehicleDataSchema.parse(vehicle);
  }

  async #delete(vehicleId: string, userId: string): Promise<VehicleData> {
    const vehicle = await this.#repository.getRequired(vehicleId);
    this.#assertVehicleOwned(vehicle, userId);

    const deletedVehicle = await this.#repository.delete(vehicleId);
    return VehicleDataSchema.parse(deletedVehicle);
  }

  async #post(body: VehicleData, userId: string): Promise<VehicleData> {
    let vehicle = await this.#repository.get(body.id);

    if (vehicle) this.#assertVehicleOwned(vehicle, userId);
    if (!vehicle) {
      vehicle = new Vehicle();
      vehicle.userId = userId;
    }

    // Update vehicle from body
    extend(vehicle, body);

    await this.#repository.createOrUpdate(vehicle);

    return VehicleDataSchema.parse(vehicle);
  }

  async #assertVehicleOwned(vehicle: Vehicle, userId: string) {
    if (vehicle.userId !== userId)
      throw new Error(
        `Vehicle ${vehicle.id} does not belong to user ${userId}!`
      );
  }
}

export default createHttpRequestHandler(VehicleHandler, false);
