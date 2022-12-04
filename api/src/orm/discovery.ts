import { z } from "zod";
import {
  ContainerAlreadyOccupiedError,
  EntityContainerNotDiscoveredError,
  EntityNotDiscoveredError,
  PropertyAlreadyDiscoveredError,
} from "./errors";
import { getConstructor } from "./helpers";

const occupiedContainers = new Set<string>();

interface DiscoveryItem {
  properties: Map<string, z.ZodTypeAny>;
  container: string | null;
}

const discovery = new Map<Function, DiscoveryItem>();

const getOrCreateItem = (ctorOrInstance: Function | Object) => {
  const ctor =
    typeof ctorOrInstance === "function"
      ? ctorOrInstance
      : ctorOrInstance.constructor;

  if (!discovery.has(ctor))
    discovery.set(ctor, { container: null, properties: new Map() });

  return discovery.get(ctor)!;
};

export const discoverEntityContainer = (ctor: Function, container: string) => {
  if (occupiedContainers.has(container)) {
    const [occupantCtor] = Array.from(discovery.entries()).find(
      ([, { container: c }]) => c === container
    )!;
    throw new ContainerAlreadyOccupiedError(occupantCtor, container);
  }

  const item = getOrCreateItem(ctor);

  item.container = container;
  occupiedContainers.add(container);
};

export const discoverEntityProperty = (
  prototype: Object,
  name: string,
  schema: z.ZodTypeAny
) => {
  const item = getOrCreateItem(prototype);

  if (item.properties.has(name))
    throw new PropertyAlreadyDiscoveredError(prototype, name);

  item.properties.set(name, schema);
};

export const getEntityContainer = (instanceOrCtor: Object | Function) => {
  const item = discovery.get(getConstructor(instanceOrCtor));

  if (!item) throw new EntityNotDiscoveredError(instanceOrCtor);
  if (!item.container)
    throw new EntityContainerNotDiscoveredError(instanceOrCtor);

  return item.container;
};

export const getEntityProperties = (instanceOrCtor: Object | Function) => {
  const item = discovery.get(getConstructor(instanceOrCtor));
  if (!item) throw new EntityNotDiscoveredError(instanceOrCtor);

  return Array.from(item.properties.entries()).map(([key, schema]) => ({
    key,
    schema,
  }));
};
