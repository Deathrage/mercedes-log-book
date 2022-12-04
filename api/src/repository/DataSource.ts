import { CosmosClient, SqlParameter } from "@azure/cosmos";
import { injectable } from "inversify";
import { isValidatable } from "../helpers/predicate";
import Entity from "../model/interfaces/Entity";
import { deserializeEntity, serializeEntity } from "../orm/data";
import { getEntityContainer } from "../orm/discovery";
import { EmptyConstructor } from "../orm/type";

@injectable()
export default class DataSource {
  constructor() {
    this.#cosmos = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
  }

  async upsert<TEntity extends Entity>(entity: TEntity): Promise<void> {
    if (isValidatable(entity)) entity.validate();

    const { resource } = await this.#database
      .container(getEntityContainer(entity))
      .items.upsert(serializeEntity(entity));

    if (!resource) throw new Error("Entity was not successfully upserted!");
    if (!entity.id) entity.id = resource.id;
  }

  async read<TEntity extends Entity>(
    type: EmptyConstructor<TEntity>,
    id: string,
    partition: string
  ): Promise<TEntity | null> {
    const { resource } = await this.#database
      .container(getEntityContainer(type))
      .item(id, partition)
      .read();

    return resource ? deserializeEntity<TEntity>(type, resource) : null;
  }

  async readAll<TEntity extends Entity>(
    type: EmptyConstructor<TEntity>,
    partition?: string
  ) {
    const { resources } = await this.#database
      .container(getEntityContainer(type))
      .items.readAll<TEntity>({
        partitionKey: partition,
      })
      .fetchAll();

    return resources.map((resource) =>
      deserializeEntity<TEntity>(type, resource)
    );
  }

  async query<TEntity extends Entity>(
    type: EmptyConstructor<TEntity>,
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

    const { resources } = await this.#database
      .container(container)
      .items.query({
        query: `SELECT * FROM ${query.alias}${whereClause}${orderByClause}${pagingClause}`,
        parameters: query.parameters,
      })
      .fetchAll();

    return resources.map((resource) =>
      deserializeEntity<TEntity>(type, resource)
    );
  }

  async sum<TEntity extends Entity>(
    type: EmptyConstructor<TEntity>,
    query: {
      alias: string;
      expression: string;
      where?: string;
      parameters?: SqlParameter[];
    }
  ) {
    const container = getEntityContainer(type);

    const whereClause = query.where ? ` WHERE ${query.where}` : "";

    const { resources } = await this.#database
      .container(container)
      .items.query<{ sum: number }>({
        query: `SELECT SUM(${query.expression}) as sum FROM ${query.alias}${whereClause}`,
        parameters: query.parameters,
      })
      .fetchAll();

    if (resources.length !== 1) throw new Error("Expected one row!");
    const sum = resources[0].sum;
    if (typeof sum !== "number")
      throw new Error("Result of sum is not a number!");

    return sum;
  }

  async delete<TEntity extends Entity>(
    type: new (...args: any[]) => TEntity,
    id: string,
    partition: string
  ): Promise<void> {
    await this.#database
      .container(getEntityContainer(type))
      .item(id, partition)
      .delete<Entity>();
  }

  #cosmos: CosmosClient;

  get #database() {
    return this.#cosmos.database(process.env.COSMOS_DB_DATABASE);
  }
}
