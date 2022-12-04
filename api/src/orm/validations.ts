import { getEntityProperties } from "./discovery";

export const validateAllProperties = (instance: Object) => {
  for (const { key, schema } of getEntityProperties(instance)) {
    const value = Reflect.get(instance, key);
    schema.parse(value);
  }
};
