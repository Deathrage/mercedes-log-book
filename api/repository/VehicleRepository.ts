import { injectable } from "inversify";
import Vehicle from "../model/Vehicle";
import { DataSource } from "./DataSource";

@injectable()
export default class VehicleRepository {
  constructor(dataSource: DataSource) {
    this.#dataSource = dataSource;
  }

  getAll(userId: string): Promise<Vehicle[]> {
    return this.#dataSource.readAll(Vehicle, userId);
  }

  get(id: string, userId: string): Promise<Vehicle | null> {
    return this.#dataSource.read(Vehicle, id, userId);
  }

  delete(id: string, userId: string): Promise<void> {
    return this.#dataSource.delete(Vehicle, id, userId);
  }

  async getRequired(id: string, userId: string): Promise<Vehicle> {
    const vehicle = await this.get(id, userId);
    if (!vehicle)
      throw new Error(`Vehicle ${id} does not exist for user ${userId}!`);
    return vehicle;
  }

  createOrUpdate(vehicle: Vehicle) {
    return this.#dataSource.upsert(vehicle);
  }

  #dataSource: DataSource;
}
