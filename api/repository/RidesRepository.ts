import { injectable } from "inversify";
import Ride from "../model/Ride";
import { DataSource } from "./DataSource";

@injectable()
export default class RidesRepository {
  constructor(dataSource: DataSource) {
    this.#dataSource = dataSource;
  }

  get(id: string, vehicleId: string): Promise<Ride | null> {
    return this.#dataSource.read(Ride, id, vehicleId);
  }

  async getRequired(id: string, vehicleId: string): Promise<Ride> {
    const ride = await this.get(id, vehicleId);
    if (!ride)
      throw new Error(`Ride ${id} does not exist for vehicle ${vehicleId}!`);
    return ride;
  }

  delete(id: string, vehicleId: string): Promise<void> {
    return this.#dataSource.delete(Ride, id, vehicleId);
  }

  createOrUpdate(ride: Ride) {
    return this.#dataSource.upsert(ride);
  }

  async paginatedFromLatest(vehicleId: string, skip: number, take: number) {
    const rides = await this.#dataSource.query(Ride, {
      alias: "r",
      where: `r.vehicleId = '${vehicleId}'`,
      pagination: {
        skip,
        take,
      },
      orderby: "r.departed DESC",
    });
    return rides;
  }

  #dataSource: DataSource;
}
