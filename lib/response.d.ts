/// <reference types="node" />
import { ServerResponse } from "http";
declare class HttpResponse extends ServerResponse {
    private response;
    private request;
    statusCode: number;
    json: Function;
    constructor(request: any, response: any);
    status(status: number): HttpResponse;
    send(data: string | object | Array<any>): void;
    serveStatic: (pathname: string, data: any) => void;
    sendError(err: string): void;
    routeNotFound(): void;
}
export default HttpResponse;
