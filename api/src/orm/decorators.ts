import { z } from "zod";
import { discoverEntityContainer, discoverEntityProperty } from "./discovery";
import { EmptyConstructor } from "./type";

export function entity(containerName: string) {
  return (target: EmptyConstructor) => {
    discoverEntityContainer(target, containerName);
    return target;
  };
}

export function property(schema: z.ZodTypeAny = z.any()) {
  return (target: Object, propertyKey: string) => {
    discoverEntityProperty(target, propertyKey, schema);
  };
}

export function id() {
  return property(z.string().optional());
}
