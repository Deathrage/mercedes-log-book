import { AnyObject, ValidationErrors } from "final-form";
import { isNumber } from "./predicate";

const turnEmptyValueToUndefined = (v: unknown) => {
  if (typeof v === "number") {
    if ((!v && v !== 0) || isNaN(v)) return undefined;
    return v;
  }
  if (v instanceof Date) {
    if (isNaN(v.valueOf())) return undefined;
    return v;
  }
  if (!v) return undefined;
  return v;
};

export const turnEmptyValuesToUndefined = <Values extends object>(
  values: Values
) => {
  const entries = Object.entries(values).map(([key, value]) => [
    key,
    turnEmptyValueToUndefined(value),
  ]);
  return Object.fromEntries(entries) as Values;
};

export const numberIsGreater = <FormValues>(
  values: FormValues,
  key: keyof FormValues,
  errors: AnyObject
) => ({
  than: (number: number) => {
    const value = values[key];

    if (!isNumber(value) || value > number) return;

    errors[key as string] = `Must be greater than ${number}.`;
  },
});

export const numberIsGreaterOrEqual = <FormValues>(
  values: FormValues,
  key: keyof FormValues,
  errors: AnyObject
) => ({
  to: (number: number) => {
    const value = values[key];

    if (!isNumber(value) || value >= number) return;

    errors[key as string] = `Must be greater or equal to ${number}.`;
  },
});

export const numberIsLessOrEqual = <FormValues>(
  values: FormValues,
  key: keyof FormValues,
  errors: AnyObject
) => ({
  to: (number: number, rate?: number, displayRated = false) => {
    const value = values[key];

    if (!isNumber(value)) return;

    const ratedValue = value * (rate ?? 1);
    const ratedNumber = number * (rate ?? 1);

    if (ratedValue <= ratedNumber) return;

    errors[key as string] = `Must be less or equal ${
      displayRated ? ratedNumber : number
    }.`;
  },
});

export const numberIsMultiple = <FormValues>(
  values: FormValues,
  key: keyof FormValues,
  errors: AnyObject
) => ({
  of: (of: number, rate?: number, displayRated = false) => {
    const value = values[key];

    if (!isNumber(value)) return;

    const ratedValue = value * (rate ?? 1);
    const ratedOf = of * (rate ?? 1);

    if (ratedValue % ratedOf === 0) return;

    errors[key as string] = `Must be a multiple of  ${
      displayRated ? ratedOf : of
    }.`;
  },
});
