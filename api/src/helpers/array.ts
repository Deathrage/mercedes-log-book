export function range(from: number, to: number): number[];
export function range<T>(
  from: number,
  to: number,
  factory: (value: number) => T
): T[];
export function range(
  from: number,
  to: number,
  factory?: (value: number) => unknown
) {
  return new Array(to - from + 1).fill(null).map((_, index) => {
    const value = from + index;

    if (typeof factory === "function") return factory(value);
    return value;
  });
}
