import { injectable } from "inversify";
import Vehicle from "../model/Vehicle";
import { DataSource } from "./DataSource";

@injectable()
export default class VehicleRepository {
  constructor(dataSource: DataSource) {
    this.#dataSource = dataSource;
  }

  getAll(): Promise<Vehicle[]> {
    return this.#dataSource.readAll(Vehicle);
  }

  get(id: string): Promise<Vehicle | null> {
    return this.#dataSource.read(Vehicle, id);
  }

  async getRequired(id: string): Promise<Vehicle> {
    const vehicle = await this.get(id);
    if (!vehicle) throw new Error(`Vehicle ${id} does not exist!`);
    return vehicle;
  }

  createOrUpdate(vehicle: Vehicle) {
    return this.#dataSource.upsert(vehicle);
  }

  #dataSource: DataSource;
}
