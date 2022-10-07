import { injectable } from "inversify";
import {
  hasCombustionEngine,
  hasElectricEngine,
} from "../helpers-shared/propulsion";
import Vehicle from "../model/Vehicle";
import VehicleEvBatteryStatusService from "../services-mercedes/VehicleEvBatteryStatusService";
import VehicleFuelStatusService from "../services-mercedes/VehicleFuelStatusService";
import VehicleOdometerStatusService from "../services-mercedes/VehicleOdometerStatusService";

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
