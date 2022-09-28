import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import { schema as RidesTraveledSchema } from "../model-shared/RidesTraveled";
import RidesRepository from "../repository/RidesRepository";
import VehicleOdometerStatusService from "../services-mercedes/VehicleOdometerStatusService";

@injectable()
class RidesTraveledHandler implements HttpRequestHandler {
  constructor(
    repository: RidesRepository,
    odometer: VehicleOdometerStatusService
  ) {
    this.#repository = repository;
    this.#odometer = odometer;
  }

  async handle({ user, params }: HttpRequest): Promise<HttpResponse> {
    const vehicleId = params.vehicleId;
    const userId = user!.username;

    const [odometer, rides] = await Promise.all([
      this.#odometer.get(vehicleId, userId),
      this.#repository.sumDistance(vehicleId),
    ]);

    return {
      body: RidesTraveledSchema.parse({
        rides,
        odometer: odometer?.distance
          ? {
              value: odometer.distance.value,
              date: new Date(odometer.distance.timestamp!),
            }
          : undefined,
      }),
    };
  }

  #repository: RidesRepository;
  #odometer: VehicleOdometerStatusService;
}

export default createHttpRequestHandler(RidesTraveledHandler, false);
