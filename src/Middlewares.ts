import { MiddlewareRoute } from "./lib/types";
import { RequestMethods } from "./index";

export class Middlewares {
  private middlewares: Array<MiddlewareRoute>;
  private latestMiddleware: Function = new Function();
  constructor() {
    this.middlewares = new Array<MiddlewareRoute>();
  }

  register(middleware: Function) {
    this.latestMiddleware = middleware;
    return this;
  }

  forRoutes(R: MiddlewareRoute | Array<MiddlewareRoute> | string) {
    let routes: Array<MiddlewareRoute> = new Array<MiddlewareRoute>();
    if (typeof R === "string") {
      routes.push({
        path: R,
        method: RequestMethods.All,
        fn: this.latestMiddleware,
      });
    }

    if (typeof R === "object" && !Array.isArray(R)) {
      if (typeof R.method == undefined) {
        R.method = RequestMethods.All;
      }
      if (typeof R.fn !== "function") {
        R.fn = this.latestMiddleware;
      }
      routes.push(R);
    }

    if (Array.isArray(R)) {
      routes = R.map((item) => {
        item.fn = this.latestMiddleware;
        return item;
      });
    }

    routes.map((item) => {
      return this.middlewares.push(item);
    });
  }
}
