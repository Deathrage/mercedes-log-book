import {
  AzureFunction,
  Context,
  HttpRequest,
  HttpResponse,
} from "@azure/functions";
import { injectable } from "inversify";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import { hasCombustionEngine, hasElectricEngine } from "../helpers/propulsion";
import ListRidesData from "../model-shared/ListRidesData";
import RidesRepository from "../repository/RidesRepository";
import VehicleRepository from "../repository/VehicleRepository";

@injectable()
class RidesHandler implements HttpRequestHandler {
  constructor(
    repository: RidesRepository,
    vehicleRepository: VehicleRepository
  ) {
    this.#repository = repository;
    this.#vehicleRepository = vehicleRepository;
  }

  async handle({ params, user }: HttpRequest): Promise<HttpResponse> {
    const userId = user!.username;
    const vehicleId = params.vehicleId;
    const page = Number(params.page);
    const pageSize = Number(params.pageSize);

    if (isNaN(page)) throw new Error("Page is not a number!");
    if (pageSize !== 10) throw new Error("Page size has to be 10!");

    return {
      body: await this.#get(vehicleId, userId, page, pageSize),
    };
  }

  async #get(
    vehicleId: string,
    userId: string,
    page: number,
    pageSize: number
  ): Promise<ListRidesData> {
    const vehicle = await this.#vehicleRepository.getRequired(
      vehicleId,
      userId
    );
    if (vehicle.userId !== userId)
      throw new Error(`Vehicle ${vehicleId} is not owned by user ${userId}!`);

    const rides = await this.#repository.paginatedFromLatest(
      vehicleId,
      pageSize * page,
      pageSize + 1
    );
    const hasMore = rides.length > pageSize;

    return {
      hasMore,
      rides: rides.slice(hasMore ? -1 : 0).map((ride) => {
        const relativeGasConsumption =
          ride.gas.start && ride.gas.end
            ? ride.gas.start - ride.gas.end
            : undefined;
        const absoluteGasConsumption =
          relativeGasConsumption && vehicle.capacity.gas
            ? relativeGasConsumption * vehicle.capacity.gas
            : undefined;

        const relativeBatteryConsumption =
          ride.battery.start && ride.battery.end
            ? ride.battery.start - ride.battery.end
            : undefined;
        const absoluteBatteryConsumption =
          relativeBatteryConsumption && vehicle.capacity.battery
            ? relativeBatteryConsumption * vehicle.capacity.battery
            : undefined;

        return {
          id: ride.id,
          reason: ride.reason,
          departed: ride.departed,
          startLocation: {
            address: ride.address.start,
            coordinates: ride.coordinates.start,
          },
          arrived: ride.arrived,
          endLocation: {
            address: ride.address.end,
            coordinates: ride.coordinates.end,
          },
          distance:
            ride.odometer.start && ride.odometer.end
              ? ride.odometer.end - ride.odometer.start
              : undefined,
          consumption: {
            gas: hasCombustionEngine(vehicle.propulsion)
              ? {
                  relative: relativeGasConsumption,
                  absolute: absoluteGasConsumption,
                }
              : undefined,
            battery: hasElectricEngine(vehicle.propulsion)
              ? {
                  relative: relativeBatteryConsumption,
                  absolute: absoluteBatteryConsumption,
                }
              : undefined,
          },
        };
      }),
    };
  }

  #vehicleRepository: VehicleRepository;
  #repository: RidesRepository;
}

export default createHttpRequestHandler(RidesHandler, false);
