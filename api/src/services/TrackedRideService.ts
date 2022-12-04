import { injectable } from "inversify";
import { z } from "zod";
import { assertVehicleOwner } from "../helpers/assert";
import Ride from "../model/entities/Ride";
import RidesRepository from "../repository/RidesRepository";
import VehicleRepository from "../repository/VehicleRepository";
import VehicleStatusService from "./VehicleStatusService";
import coordinates from "../model/schemas/coordinates";

type Coordinates = z.infer<typeof coordinates>;

@injectable()
export default class TrackedRideService {
  constructor(
    vehicleRepository: VehicleRepository,
    rideRepository: RidesRepository,
    statusService: VehicleStatusService
  ) {
    this.#vehicleRepository = vehicleRepository;
    this.#rideRepository = rideRepository;
    this.#statusService = statusService;
  }

  async getCurrentRide(
    vehicleId: string,
    userId: string
  ): Promise<string | null> {
    const vehicle = await this.#vehicleRepository.getRequired(
      vehicleId,
      userId
    );
    assertVehicleOwner(vehicle, userId);

    return vehicle.onRideId ?? null;
  }

  async beginRide(
    coordinates: Coordinates | null,
    vehicleId: string,
    userId: string
  ): Promise<string> {
    const vehicle = await this.#vehicleRepository.getRequired(
      vehicleId,
      userId
    );
    assertVehicleOwner(vehicle, userId);

    if (vehicle.onRideId)
      throw new Error(
        `Vehicle ${vehicle.id} is already on ride ${vehicle.onRideId}. Finish the ride first!`
      );

    const { odometer, fuel, battery } = await this.#statusService.getStatus(
      vehicle,
      userId
    );

    const ride = new Ride();
    ride.departed = new Date();
    ride.address = {};
    ride.coordinates = {
      start: coordinates ? coordinates : undefined,
    };
    ride.odometer = {
      start: odometer?.distance?.value,
    };
    ride.gas = {
      start: fuel?.tankLevel?.value,
    };
    ride.battery = {
      start: battery?.batteryLevel?.value,
    };
    ride.vehicleId = vehicle.id;

    await this.#rideRepository.createOrUpdate(ride);

    vehicle.onRideId = ride.id;
    await this.#vehicleRepository.createOrUpdate(vehicle);

    return ride.id;
  }

  async finishRide(
    coordinates: Coordinates | null,
    vehicleId: string,
    userId: string
  ): Promise<string> {
    const vehicle = await this.#vehicleRepository.getRequired(
      vehicleId,
      userId
    );
    assertVehicleOwner(vehicle, userId);

    if (!vehicle.onRideId)
      throw new Error(
        `Vehicle ${vehicle.id} is not on a ride. Start the ride first!`
      );

    const [ride, { odometer, battery, fuel }] = await Promise.all([
      this.#rideRepository.getRequired(vehicle.onRideId, vehicle.id),
      this.#statusService.getStatus(vehicle, userId),
    ]);

    ride.arrived = new Date();
    ride.coordinates.end = coordinates ? coordinates : undefined;
    ride.odometer.end = odometer?.distance?.value;
    ride.gas.end = fuel?.tankLevel?.value;
    ride.battery.end = battery?.batteryLevel?.value;
    await this.#rideRepository.createOrUpdate(ride);

    vehicle.onRideId = undefined;
    await this.#vehicleRepository.createOrUpdate(vehicle);

    return ride.id;
  }

  async cancelRide(vehicleId: string, userId: string): Promise<void> {
    const vehicle = await this.#vehicleRepository.getRequired(
      vehicleId,
      userId
    );
    assertVehicleOwner(vehicle, userId);

    if (!vehicle.onRideId)
      throw new Error(
        `Vehicle ${vehicle.id} is not on a ride. Start the ride first!`
      );

    const rideToDelete = vehicle.onRideId;
    vehicle.onRideId = undefined;

    await this.#vehicleRepository.createOrUpdate(vehicle);
    await this.#rideRepository.delete(rideToDelete, vehicle.id);
  }

  #vehicleRepository: VehicleRepository;
  #rideRepository: RidesRepository;
  #statusService: VehicleStatusService;
}
