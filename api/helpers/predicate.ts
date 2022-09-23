import Validatable from "../model/Validatable";

export const isValidatable = (obj: any): obj is Validatable =>
  "validate" in obj;
