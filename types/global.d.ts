export {};

declare global {
  type Maybe<T> = T | null | undefined;
  type NonEmptyArray<T> = [T, ...T[]];
}
