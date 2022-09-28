import { CosmosClient, SqlParameter } from "@azure/cosmos";
import { injectable } from "inversify";
import { getEntityContainer } from "../decorators/entity";
import { isNumber, isValidatable } from "../helpers/predicate";
import Entity from "../model/Entity";

@injectable()
export class DataSource {
  constructor() {
    this.#cosmos = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
  }

  async upsert<TEntity extends Entity>(entity: TEntity): Promise<void> {
    const container = this.#getEntityContainer(entity);

    if (isValidatable(entity)) entity.validate();

    const { resource } = await this.#cosmos
      .database(this.#database)
      .container(container)
      .items.upsert(entity);

    if (!resource) throw new Error("Entity was not successfully upserted!");
    if (!entity.id) entity.id = resource.id;
  }

  async read<TEntity extends Entity>(
    type: new (entity: TEntity) => TEntity,
    id: string,
    partition: string
  ): Promise<TEntity | null> {
    const container = getEntityContainer(type);
    const { resource } = await this.#cosmos
      .database(this.#database)
      .container(container)
      .item(id, partition)
      .read<TEntity>();

    if (!resource) return null;
    return new type(resource);
  }

  async readAll<TEntity extends Entity>(
    type: new (entity: TEntity) => TEntity,
    partition?: string
  ) {
    const container = getEntityContainer(type);
    const { resources } = await this.#cosmos
      .database(this.#database)
      .container(container)
      .items.readAll<TEntity>({
        partitionKey: partition,
      })
      .fetchAll();

    return resources.map((resource) => new type(resource));
  }

  async query<TEntity extends Entity>(
    type: new (entity: TEntity) => TEntity,
    query: {
      alias: string;
      where?: string;
      parameters?: SqlParameter[];
      pagination?: {
        take: number;
        skip: number;
      };
      orderby?: string;
    }
  ): Promise<TEntity[]> {
    const container = getEntityContainer(type);

    const whereClause = query.where ? ` WHERE ${query.where}` : "";
    const pagingClause = query.pagination
      ? ` OFFSET ${query.pagination.skip} LIMIT ${query.pagination.take}`
      : "";
    const orderByClause = query.orderby ? ` ORDER BY ${query.orderby}` : "";

    const { resources } = await this.#cosmos
      .database(this.#database)
      .container(container)
      .items.query<TEntity>({
        query: `SELECT * FROM ${query.alias}${whereClause}${orderByClause}${pagingClause}`,
        parameters: query.parameters,
      })
      .fetchAll();

    return resources.map((resource) => new type(resource));
  }

  async sum<TEntity extends Entity>(
    type: new (...args: any[]) => TEntity,
    query: {
      alias: string;
      expression: string;
      where?: string;
      parameters?: SqlParameter[];
    }
  ) {
    const container = getEntityContainer(type);

    const whereClause = query.where ? ` WHERE ${query.where}` : "";

    const { resources } = await this.#cosmos
      .database(this.#database)
      .container(container)
      .items.query<{ sum: number }>({
        query: `SELECT SUM(${query.expression}) as sum FROM ${query.alias}${whereClause}`,
        parameters: query.parameters,
      })
      .fetchAll();

    if (resources.length !== 1) throw new Error("Expected one row!");
    const sum = resources[0].sum;
    if (!isNumber(sum)) throw new Error("Result of sum is not a number!");

    return sum;
  }

  async delete<TEntity extends Entity>(
    type: new (...args: any[]) => TEntity,
    id: string,
    partition: string
  ): Promise<void> {
    const container = getEntityContainer(type);
    await this.#cosmos
      .database(this.#database)
      .container(container)
      .item(id, partition)
      .delete<Entity>();
  }

  #getEntityContainer(entity: any) {
    if (typeof entity !== "object")
      throw new Error("Entity has to be an object!");
    if (!entity) throw new Error("Entity is null or undefined!");

    const type = entity.constructor;
    if (!type) throw new Error("Entity does not have a constructor!");
    if (typeof type !== "function")
      throw new Error(
        "Entity does not have a function in constructor property!"
      );

    return getEntityContainer(type);
  }

  #cosmos: CosmosClient;

  get #database() {
    return process.env.COSMOS_DB_DATABASE;
  }
}
