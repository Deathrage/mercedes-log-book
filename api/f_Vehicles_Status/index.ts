import { injectable } from "inversify";
import { assertVehicleOwner } from "../src/helpers/assert";
import { createHttpHandler } from "../src/http";
import HttpHandler from "../src/http/HttpHandler";
import HttpRequest from "../src/http/HttpRequest";
import HttpResponse from "../src/http/HttpResponse";
import VehicleRepository from "../src/repository/VehicleRepository";
import VehicleStatusService from "../src/services/VehicleStatusService";
import { GET } from "./schema";

@injectable()
class VehicleStatusHandler extends HttpHandler {
  constructor(
    repository: VehicleRepository,
    statusService: VehicleStatusService
  ) {
    super();
    this.#statusService = statusService;
    this.#repository = repository;
  }

  async get(req: HttpRequest): Promise<HttpResponse> {
    const vehicleId = req.params.required.id;
    const userId = req.userId.required;

    const vehicle = await this.#repository.getRequired(vehicleId, userId);
    assertVehicleOwner(vehicle, userId);

    const { odometer, fuel, battery } = await this.#statusService.getStatus(
      vehicle,
      userId
    );

    const response = {
      vehicleId,
      odometer: odometer?.distance
        ? {
            value: odometer.distance.value,
            date: new Date(odometer.distance.timestamp!),
          }
        : undefined,
      gas: fuel
        ? {
            range: fuel.tankRange
              ? {
                  value: fuel.tankRange.value,
                  date: new Date(fuel.tankRange.timestamp!),
                }
              : undefined,
            level: fuel.tankLevel
              ? {
                  value: fuel.tankLevel.value,
                  date: new Date(fuel.tankLevel.timestamp!),
                }
              : undefined,
          }
        : undefined,
      battery: battery
        ? {
            range: battery.batteryRange
              ? {
                  value: battery.batteryRange.value,
                  date: new Date(battery.batteryRange.timestamp!),
                }
              : undefined,
            level: battery.batteryLevel
              ? {
                  value: battery.batteryLevel.value,
                  date: new Date(battery.batteryLevel.timestamp!),
                }
              : undefined,
          }
        : undefined,
    };

    return {
      body: GET.response.parse(response),
    };
  }

  #repository: VehicleRepository;
  #statusService: VehicleStatusService;
}

export default createHttpHandler(VehicleStatusHandler);
