import Validatable from "../model/interfaces/Validatable";

export const isValidatable = (obj: any): obj is Validatable =>
  ("validate" as keyof Validatable) in obj;
