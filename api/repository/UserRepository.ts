import { injectable } from "inversify";
import User from "../model/User";
import { DataSource } from "./DataSource";

@injectable()
export default class UserRepository {
  constructor(dataSource: DataSource) {
    this.#dataSource = dataSource;
  }

  async get(id: string): Promise<User> {
    const user = await this.#dataSource.read(User, id);

    if (!user) throw new Error(`User ${id} does not exist!`);

    return user;
  }

  async upsert(user: User): Promise<void> {
    await this.#dataSource.upsert(user);
  }

  async getOrCreate(id: string, fallback: User) {
    let user = await this.get(id);
    if (!user) {
      user = fallback;
      await this.#dataSource.upsert(user);
    }
    return user;
  }

  #dataSource: DataSource;
}
