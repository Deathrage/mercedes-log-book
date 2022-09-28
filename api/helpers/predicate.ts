import Validatable from "../model/Validatable";

export const isValidatable = (obj: any): obj is Validatable =>
  "validate" in obj;

export const isNumber = (val: unknown): val is number => {
  if (typeof val !== "number") return false;
  return !isNaN(val);
};
