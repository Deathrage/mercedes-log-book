import { injectable } from "inversify";
import { DataSource } from "./DataSource";

@injectable()
export class TokenRepository {
  constructor(dataSource: DataSource) {
    this.#dataSource = dataSource;
  }

  #dataSource: DataSource;
}
