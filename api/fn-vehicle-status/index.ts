import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import VehicleStatusData from "../model-shared/VehicleStatusData";
import VehicleRepository from "../repository/VehicleRepository";
import VehicleStatusService from "../services/VehicleStatusService";

@injectable()
class VehicleStatusHandler implements HttpRequestHandler {
  constructor(
    repository: VehicleRepository,
    statusService: VehicleStatusService
  ) {
    this.#statusService = statusService;
    this.#repository = repository;
  }

  async handle({
    params: { id: vehicleId },
    user,
  }: HttpRequest): Promise<HttpResponse> {
    const userId = user!.username;
    return {
      body: await this.#get(vehicleId, userId),
    };
  }

  async #get(vehicleId: string, userId: string): Promise<VehicleStatusData> {
    const vehicle = await this.#repository.getRequired(vehicleId, userId);
    if (vehicle.userId !== userId)
      throw new Error(`Vehicle ${vehicleId} is not owned by ${userId}!`);

    const { odometer, fuel, battery } = await this.#statusService.getStatus(
      vehicle,
      userId
    );

    return {
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
  }

  #repository: VehicleRepository;
  #statusService: VehicleStatusService;
}

export default createHttpRequestHandler(VehicleStatusHandler, false);
