import { getConstructor } from "./helpers";

const getName = (ctorOrInstanceOrPrototype: Function | Object) =>
  getConstructor(ctorOrInstanceOrPrototype).name;

export class EntityNotDiscoveredError extends Error {
  constructor(ctorOrInstanceOrPrototype: Function | Object) {
    super(
      `Entity ${getName(
        ctorOrInstanceOrPrototype
      )} has not been discovered yet! Did you forget to specify @entity?`
    );
  }
}

export class EntityContainerNotDiscoveredError extends Error {
  constructor(ctorOrInstanceOrPrototype: Function | Object) {
    super(
      `Entity ${getName(
        ctorOrInstanceOrPrototype
      )} container has not been discovered yet! Did you forget to specify @entity?`
    );
  }
}

export class ContainerAlreadyOccupiedError extends Error {
  constructor(occupant: Function | Object, container: string) {
    super(
      `Container ${container} is already occupied by ${getName(
        occupant
      )}! Did you specify same container for multiple @entity?`
    );
  }
}

export class PropertyAlreadyDiscoveredError extends Error {
  constructor(
    ctorOrInstanceOrPrototype: Function | Object,
    propertyKey: string
  ) {
    super(
      `Property ${propertyKey} of ${getName(
        ctorOrInstanceOrPrototype
      )} is already discovered! Did you specify @property multiple times?`
    );
  }
}
