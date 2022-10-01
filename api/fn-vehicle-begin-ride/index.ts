import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import {
  hasCombustionEngine,
  hasElectricEngine,
} from "../helpers-shared/propulsion";
import { assertVehicleOwner } from "../helpers/assert";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import { schema as CoordinatesSchema } from "../model-shared/Coordinates";
import Ride from "../model/Ride";
import RidesRepository from "../repository/RidesRepository";
import VehicleRepository from "../repository/VehicleRepository";
import VehicleEvBatteryStatusService from "../services-mercedes/VehicleEvBatteryStatusService";
import VehicleFuelStatusService from "../services-mercedes/VehicleFuelStatusService";
import VehicleOdometerStatusService from "../services-mercedes/VehicleOdometerStatusService";
import { schema as RideDataSchema } from "../model-shared/RideData";

@injectable()
class BeginRideHandler implements HttpRequestHandler {
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

    if (vehicle.onRideId)
      throw new Error(
        `Vehicle ${vehicle.id} is already on ride ${vehicle.onRideId}. Finish the ride first!`
      );

    const [odometer, fuel, battery] = await Promise.all([
      this.#odometer.get(vehicleId, userId),
      hasCombustionEngine(vehicle.propulsion)
        ? this.#fuel.get(vehicleId, userId)
        : null,
      hasElectricEngine(vehicle.propulsion)
        ? this.#battery.get(vehicleId, userId)
        : null,
    ]);

    const ride = new Ride({
      departed: new Date(),
      address: {},
      coordinates: {
        start: req.body ? CoordinatesSchema.parse(req.body) : undefined,
      },
      odometer: {
        start: odometer?.distance?.value,
      },
      gas: {
        start: fuel?.tankLevel?.value,
      },
      battery: {
        start: battery?.batteryLevel?.value,
      },
      vehicleId: vehicle.id,
    });

    await this.#rideRepository.createOrUpdate(ride);

    vehicle.onRideId = ride.id;

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

export default createHttpRequestHandler(BeginRideHandler, false);
