import { injectable } from "inversify";
import Ride from "../model/Ride";
import { DataSource } from "./DataSource";

@injectable()
export default class RidesRepository {
  constructor(dataSource: DataSource) {
    this.#dataSource = dataSource;
  }

  get(id: string): Promise<Ride | null> {
    return this.#dataSource.read(Ride, id);
  }

  async getRequired(id: string): Promise<Ride> {
    const ride = await this.get(id);
    if (!ride) throw new Error(`Ride ${id} does not exist!`);
    return ride;
  }

  async delete(id: string): Promise<Ride> {
    const ride = await this.#dataSource.delete(Ride, id);
    if (!ride) throw new Error(`Ride ${id} does not exist!`);
    return ride;
  }

  createOrUpdate(ride: Ride) {
    return this.#dataSource.upsert(ride);
  }

  async paginatedFromLatest(vehicleId: string, skip: number, take: number) {
    const rides = await this.#dataSource.query(Ride, {
      where: `vehicleId = ${vehicleId}`,
      pagination: {
        skip,
        take,
      },
      orderby: "start DESC",
    });
    return rides;
  }

  #dataSource: DataSource;
}
