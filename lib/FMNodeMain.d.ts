declare class FMNodeMain {
    private server;
    private config;
    private sourceDir;
    private matchRoute;
    private middlewares;
    private onListen;
    /**
     * Creates an instance of mine js.
     * @param [port]
     */
    constructor(port?: Number);
    on(type: string, fun: Function): void;
    /**
     * Listens mine js
     * @param [port]
     * @param [callback]
     */
    init(): Promise<void>;
}
export default FMNodeMain;
