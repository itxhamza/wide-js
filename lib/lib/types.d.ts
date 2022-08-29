export declare type Dictionary = {
    [key: string]: any;
};
export declare type MiddlewareRoute = {
    path: string;
    method: string;
    fn: Function;
};
export declare type FMNodeType = {
    get: Function;
    post: Function;
    put: Function;
    delete: Function;
    middleware: Function;
};
