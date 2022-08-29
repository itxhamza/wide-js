export type Dictionary = {
  [key: string]: any;
};

export type MiddlewareRoute = {
  path: string;
  method: string;
  fn: Function;
};

export type FMNodeType = {
  get: Function;
  post: Function;
  put: Function;
  delete: Function;
  middleware: Function;
};
