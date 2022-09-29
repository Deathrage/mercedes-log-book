export const isNumber = (val: unknown): val is number => {
  if (typeof val !== "number") return false;
  return !isNaN(val);
};
