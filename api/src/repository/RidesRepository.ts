import { injectable } from "inversify";
import Ride from "../model/entities/Ride";
import DataSource from "./DataSource";

@injectable()
export default class RidesRepository {
  constructor(dataSource: DataSource) {
    this.#dataSource = dataSource;
  }

  sumDistance(vehicleId: string) {
    return this.#dataSource.sum(Ride, {
      alias: "r",
      // end is a reserved word
      expression: "r.odometer['end'] - r.odometer.start",
      where: `r.vehicleId = '${vehicleId}'`,
    });
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

  betweenDates(vehicleId: string, dates: { from: Date; to: Date }) {
    return this.#dataSource.query(Ride, {
      alias: "r",
      where: `r.vehicleId = '${vehicleId}' AND '${dates.from.toJSON()}' <= r.departed AND r.departed <= '${dates.to.toJSON()}'`,
      orderby: "r.departed DESC",
    });
  }

  paginatedFromLatest(vehicleId: string, skip: number, take: number) {
    return this.#dataSource.query(Ride, {
      alias: "r",
      where: `r.vehicleId = '${vehicleId}'`,
      pagination: {
        skip,
        take,
      },
      orderby: "r.departed DESC",
    });
  }

  #dataSource: DataSource;
}
