export function toObject<T, Key extends string | number | symbol = string>(
  items: T[],
  key: (item: T) => Key
): Record<Key, T>;
export function toObject<
  T,
  Key extends string | number | symbol = string,
  Value = any
>(
  items: T[],
  key: (item: T) => Key,
  value: (item: T) => Value
): Record<Key, Value>;
export function toObject<T, Key extends string | number | symbol, Value>(
  items: T[],
  key: (t: T) => Key,
  value?: (t: T) => Value
) {
  const result = {} as Record<Key, Value>;

  // Even though T and Value are unrelated, we know that if value is specified it's gonna be Value
  // and when is not, it's gonna be T as they are different overloads
  for (const item of items)
    result[key(item)] = value ? value(item) : (item as any);

  return result;
}
