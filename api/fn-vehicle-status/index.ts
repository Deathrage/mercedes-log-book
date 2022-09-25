import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import PropulsionType from "../model-shared/PropulsionType";
import VehicleStatusData, {
  schema as VehicleStatusDataSchema,
} from "../model-shared/VehicleStatusData";
import VehicleRepository from "../repository/VehicleRepository";
import VehicleEvBatteryStatusService from "../services-mercedes/VehicleEvBatteryStatusService";
import VehicleFuelStatusService from "../services-mercedes/VehicleFuelStatusService";
import VehicleOdometerStatusService from "../services-mercedes/VehicleOdometerStatusService";

@injectable()
class VehicleStatusHandler implements HttpRequestHandler {
  constructor(
    repository: VehicleRepository,
    odometer: VehicleOdometerStatusService,
    fuel: VehicleFuelStatusService,
    battery: VehicleEvBatteryStatusService
  ) {
    this.#battery = battery;
    this.#repository = repository;
    this.#odometer = odometer;
    this.#fuel = fuel;
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const userId = req.user!.username;
    const vehicleId = req.params.id;
    if (!vehicleId) throw new Error("Missing required parameter id!");

    return {
      body: await this.#get(vehicleId, userId),
    };
  }

  async #get(vehicleId: string, userId: string): Promise<VehicleStatusData> {
    const vehicle = await this.#repository.getRequired(vehicleId);
    if (vehicle.userId !== userId)
      throw new Error(`Vehicle ${vehicleId} is not owned by ${userId}!`);

    const [odometer, fuel, battery] = await Promise.all([
      this.#odometer.get(vehicleId, userId),
      [PropulsionType.COMBUSTION, PropulsionType.PLUGIN_HYBRID].includes(
        vehicle.propulsion
      )
        ? this.#fuel.get(vehicleId, userId)
        : null,
      [PropulsionType.ELECTRICITY, PropulsionType.PLUGIN_HYBRID].includes(
        vehicle.propulsion
      )
        ? this.#battery.get(vehicleId, userId)
        : null,
    ]);

    return VehicleStatusDataSchema.parse({
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
            capacity: vehicle.capacity.gas,
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
            capacity: vehicle.capacity.battery,
          }
        : undefined,
    });
  }

  #repository: VehicleRepository;
  #odometer: VehicleOdometerStatusService;
  #fuel: VehicleFuelStatusService;
  #battery: VehicleEvBatteryStatusService;
}

export default createHttpRequestHandler(VehicleStatusHandler, false);
