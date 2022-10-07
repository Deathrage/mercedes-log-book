import { injectable } from "inversify";
import { assertVehicleOwner } from "../helpers/assert";
import Coordinates from "../model-shared/Coordinates";
import Ride from "../model/Ride";
import RidesRepository from "../repository/RidesRepository";
import VehicleRepository from "../repository/VehicleRepository";
import VehicleStatusService from "./VehicleStatusService";

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
  ): Promise<Ride | null> {
    const vehicle = await this.#vehicleRepository.getRequired(
      vehicleId,
      userId
    );
    assertVehicleOwner(vehicle, userId);

    if (!vehicle.onRideId) return null;

    return this.#rideRepository.getRequired(vehicle.onRideId, vehicle.id);
  }

  async beginRide(
    coordinates: Coordinates | null,
    vehicleId: string,
    userId: string
  ): Promise<Ride> {
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
    const ride = new Ride({
      departed: new Date(),
      address: {},
      coordinates: {
        start: coordinates ? coordinates : undefined,
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
    await this.#vehicleRepository.createOrUpdate(vehicle);

    return ride;
  }

  async finishRide(
    coordinates: Coordinates | null,
    vehicleId: string,
    userId: string
  ) {
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

    return ride;
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
