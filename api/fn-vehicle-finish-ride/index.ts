import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import {
  hasCombustionEngine,
  hasElectricEngine,
} from "../helpers-shared/propulsion";
import { assertVehicleOwner } from "../helpers/assert";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import RidesRepository from "../repository/RidesRepository";
import VehicleRepository from "../repository/VehicleRepository";
import VehicleEvBatteryStatusService from "../services-mercedes/VehicleEvBatteryStatusService";
import VehicleFuelStatusService from "../services-mercedes/VehicleFuelStatusService";
import VehicleOdometerStatusService from "../services-mercedes/VehicleOdometerStatusService";
import { schema as CoordinatesSchema } from "../model-shared/Coordinates";
import { schema as RideDataSchema } from "../model-shared/RideData";

@injectable()
class FinishRideHandler implements HttpRequestHandler {
  constructor(
    vehicleRepository: VehicleRepository,
    rideRepository: RidesRepository,
    odometer: VehicleOdometerStatusService,
    fuel: VehicleFuelStatusService,
    battery: VehicleEvBatteryStatusService
  ) {
    this.#vehicleRepository = vehicleRepository;
    this.#rideRepository = rideRepository;
    this.#odometer = odometer;
    this.#fuel = fuel;
    this.#battery = battery;
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const userId = req.user!.username;
    const vehicleId = req.params.id;

    const vehicle = await this.#vehicleRepository.getRequired(
      vehicleId,
      userId
    );

    assertVehicleOwner(vehicle, userId);

    if (!vehicle.onRideId)
      throw new Error(
        `Vehicle ${vehicle.id} is not on a ride. Start the ride first!`
      );

    const [ride, odometer, fuel, battery] = await Promise.all([
      this.#rideRepository.getRequired(vehicle.onRideId, vehicle.id),
      this.#odometer.get(vehicleId, userId),
      hasCombustionEngine(vehicle.propulsion)
        ? this.#fuel.get(vehicleId, userId)
        : null,
      hasElectricEngine(vehicle.propulsion)
        ? this.#battery.get(vehicleId, userId)
        : null,
    ]);

    ride.coordinates.end = req.body
      ? CoordinatesSchema.parse(req.body)
      : undefined;
    ride.odometer.end = odometer?.distance?.value;
    ride.gas.end = fuel?.tankLevel?.value;
    ride.battery.end = battery?.batteryLevel?.value;

    this.#rideRepository.createOrUpdate(ride);

    return {
      body: RideDataSchema.parse(ride),
    };
  }

  #rideRepository: RidesRepository;
  #vehicleRepository: VehicleRepository;
  #odometer: VehicleOdometerStatusService;
  #fuel: VehicleFuelStatusService;
  #battery: VehicleEvBatteryStatusService;
}

export default createHttpRequestHandler(FinishRideHandler, false);
