export const getConstructor = (instanceOrCtor: Object | Function) =>
  typeof instanceOrCtor === "function"
    ? instanceOrCtor
    : instanceOrCtor.constructor;
