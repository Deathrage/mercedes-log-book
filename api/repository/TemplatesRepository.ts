import { injectable } from "inversify";
import Template from "../model/Template";
import { DataSource } from "./DataSource";

@injectable()
export default class TemplatesRepository {
  constructor(dataSource: DataSource) {
    this.#dataSource = dataSource;
  }

  get(id: string, userId: string) {
    return this.#dataSource.read(Template, id, userId);
  }

  async getRequired(id: string, userId: string) {
    const template = await this.get(id, userId);
    if (!template)
      throw new Error(`Template ${id} does not exist for user ${userId}!`);
    return template;
  }

  delete(id: string, userId: string): Promise<void> {
    return this.#dataSource.delete(Template, id, userId);
  }

  createOrUpdate(template: Template) {
    return this.#dataSource.upsert(template);
  }

  paginatedFromLatest(userId: string, skip: number, take: number) {
    return this.#dataSource.query(Template, {
      alias: "t",
      where: `t.vehicleId = '${userId}'`,
      pagination: {
        skip,
        take,
      },
    });
  }

  #dataSource: DataSource;
}
