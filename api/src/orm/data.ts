import { getEntityProperties } from "./discovery";
import { EmptyConstructor } from "./type";

export const serializeEntity = <Entity extends Object>(instance: Entity) => {
  const data: Record<string, any> = {};

  for (const { key } of getEntityProperties(instance))
    data[key] = Reflect.get(instance, key);

  return data;
};

export const deserializeEntity = <Entity extends Object>(
  type: EmptyConstructor<Entity>,
  data: Record<string, any>
) => {
  const instance = new type();

  for (const { key, schema } of getEntityProperties(instance))
    Reflect.set(instance, key, schema.parse(data[key]));

  return instance;
};
