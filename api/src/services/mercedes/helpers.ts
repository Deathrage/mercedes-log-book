import Timestamped from "../../model/interfaces/Timestamped";
import { Resource } from "./__generated__";

export const findResource = <Response extends object, Value>(
  responses: Response[],
  key: keyof Response,
  parser: (value: Resource) => Timestamped<Value> | undefined
) => {
  const response = responses.find((r) => Reflect.has(r, key));
  if (!response) return undefined;
  return parser(Reflect.get(response, key));
};

export const parseBoolean = (
  value: Resource
): Timestamped<boolean> | undefined => {
  if (!value.timestamp || !value.value) return undefined;
  return {
    value: value === "true" ? true : false,
    timestamp: value.timestamp,
  };
};

export const parseNumber = (
  value: Resource
): Timestamped<number> | undefined => {
  if (!value.timestamp || !value.value) return undefined;
  return {
    value: Number(value.value),
    timestamp: value.timestamp,
  };
};

export const parsePercentNumber = (value: Resource) => {
  const parsed = parseNumber(value);
  if (parsed) parsed.value = parsed.value / 100;
  return parsed;
};
