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
