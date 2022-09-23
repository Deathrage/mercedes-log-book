import { CosmosClient, SqlParameter } from "@azure/cosmos";
import { injectable } from "inversify";
import { getEntityContainer } from "../decorators/entity";
import { isValidatable } from "../helpers/predicate";
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
    id: string
  ): Promise<TEntity | null> {
    const container = getEntityContainer(type);
    const { resource } = await this.#cosmos
      .database(this.#database)
      .container(container)
      .item(id, id)
      .read<TEntity>();

    if (!resource) return null;
    return new type(resource);
  }

  async readAll<TEntity extends Entity>(
    type: new (entity: TEntity) => TEntity
  ) {
    const container = getEntityContainer(type);
    const { resources } = await this.#cosmos
      .database(this.#database)
      .container(container)
      .items.readAll<TEntity>()
      .fetchAll();

    return resources.map((resource) => new type(resource));
  }

  async query<TEntity extends Entity>(
    type: new (entity: TEntity) => TEntity,
    query: {
      where?: string;
      parameters?: SqlParameter[];
      paging?: {
        take: number;
        skip: number;
      };
    }
  ): Promise<TEntity[]> {
    const container = getEntityContainer(type);

    const whereClause = query.where ? ` WHERE ${query.where}` : "";
    const pagingClause = query.paging
      ? ` OFFSET ${query.paging.skip} LIMIT ${query.paging.take}`
      : "";

    const { resources } = await this.#cosmos
      .database(this.#database)
      .container(container)
      .items.query<TEntity>({
        query: `SELECT * FROM entity${whereClause}${pagingClause}`,
        parameters: query.parameters,
      })
      .fetchAll();

    return resources.map((resource) => new type(resource));
  }

  async delete<TEntity extends Entity>(
    type: new (...args: any[]) => TEntity,
    id: string
  ): Promise<TEntity> {
    const container = getEntityContainer(type);
    const { resource } = await this.#cosmos
      .database(this.#database)
      .container(container)
      .item(id, id)
      .delete<Entity>();

    if (!resource) throw new Error(`Entity for id ${id} was not found!`);

    return new type(resource);
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
