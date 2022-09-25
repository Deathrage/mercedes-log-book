import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import extend from "just-extend";
import { assertValidRequest, assertVehicleOwner } from "../helpers/assert";
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
    assertValidRequest(req, ["GET", "POST", "DELETE"], {
      GET: ["id"],
      DELETE: ["id"],
    });

    if (req.method === "POST")
      return {
        body: await this.#post(
          VehicleDataSchema.parse(req.body),
          req.user!.username
        ),
      };

    const vehicleId = req.params.id;
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

    assertVehicleOwner(vehicle, userId);

    return VehicleDataSchema.parse(vehicle);
  }

  async #delete(vehicleId: string, userId: string): Promise<VehicleData> {
    const vehicle = await this.#repository.getRequired(vehicleId);

    assertVehicleOwner(vehicle, userId);

    const deletedVehicle = await this.#repository.delete(vehicleId);
    return VehicleDataSchema.parse(deletedVehicle);
  }

  async #post(body: VehicleData, userId: string): Promise<VehicleData> {
    let vehicle = await this.#repository.get(body.id);

    if (vehicle) assertVehicleOwner(vehicle, userId);
    if (!vehicle) {
      vehicle = new Vehicle();
      vehicle.userId = userId;
    }

    // Update vehicle from body
    extend(vehicle, body);

    await this.#repository.createOrUpdate(vehicle);

    return VehicleDataSchema.parse(vehicle);
  }
}

export default createHttpRequestHandler(VehicleHandler, false);
