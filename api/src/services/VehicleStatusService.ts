import { injectable } from "inversify";
import { hasCombustionEngine, hasElectricEngine } from "../helpers/propulsion";
import Vehicle from "../model/entities/Vehicle";
import VehicleEvBatteryStatusService from "./mercedes/VehicleEvBatteryStatusService";
import VehicleFuelStatusService from "./mercedes/VehicleFuelStatusService";
import VehicleOdometerStatusService from "./mercedes/VehicleOdometerStatusService";

@injectable()
export default class VehicleStatusService {
  constructor(
    odometer: VehicleOdometerStatusService,
    fuel: VehicleFuelStatusService,
    battery: VehicleEvBatteryStatusService
  ) {
    this.#odometer = odometer;
    this.#fuel = fuel;
    this.#battery = battery;
  }

  async getStatus({ id, propulsion }: Vehicle, userId: string) {
    const [odometer, fuel, battery] = await Promise.all([
      this.#odometer.get(id, userId),
      hasCombustionEngine(propulsion) ? this.#fuel.get(id, userId) : null,
      hasElectricEngine(propulsion) ? this.#battery.get(id, userId) : null,
    ]);

    return {
      odometer,
      fuel,
      battery,
    };
  }

  #odometer: VehicleOdometerStatusService;
  #fuel: VehicleFuelStatusService;
  #battery: VehicleEvBatteryStatusService;
}
