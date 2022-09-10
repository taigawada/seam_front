export type Commit<T extends any[] | [undefined] = []> = (
  arg0: string,
  ...arg1: T
) => void;
