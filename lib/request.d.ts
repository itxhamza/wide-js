import { Dictionary } from "./lib/types";
/**
 * Http request
 */
declare class HttpRequest {
    private request;
    private response;
    baseUrl: string;
    originalUrl: string;
    fullPath: string | null;
    _parsedUrl: Dictionary;
    protocol: string;
    query: Dictionary;
    params: Dictionary;
    private matchRoute;
    private config;
    /**
     * Creates an instance of http request.
     * @param request
     * @param response
     */
    constructor(request: any, response: any, config: any);
    isClass(func: any): boolean;
    /**
     * Next func
     * @param matchRoute
     */
    nextFunc(matchRoute: any): void;
    runRequestMethods(route: any): void;
    sendRequest(fn: Function): void;
    /**
     * Inits http request
     * @param routes
     * @returns init
     */
    init(matchRoute: Function, config: Dictionary, sourceDir: string, middlewares: Array<Dictionary>): void;
    hasMiddlewares(middlewares: Dictionary[], matchRoute: any): (boolean | undefined)[];
    serveStatic(): void;
}
export default HttpRequest;
