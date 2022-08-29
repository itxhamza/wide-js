import { MiddlewareRoute } from "./lib/types";
export declare class Middlewares {
    private middlewares;
    private latestMiddleware;
    constructor();
    register(middleware: Function): this;
    forRoutes(R: MiddlewareRoute | Array<MiddlewareRoute> | string): void;
}
