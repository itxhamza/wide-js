"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middlewares = void 0;
const index_1 = require("./index");
class Middlewares {
    constructor() {
        this.latestMiddleware = new Function();
        this.middlewares = new Array();
    }
    register(middleware) {
        this.latestMiddleware = middleware;
        return this;
    }
    forRoutes(R) {
        let routes = new Array();
        if (typeof R === "string") {
            routes.push({
                path: R,
                method: index_1.RequestMethods.All,
                fn: this.latestMiddleware,
            });
        }
        if (typeof R === "object" && !Array.isArray(R)) {
            if (typeof R.method == undefined) {
                R.method = index_1.RequestMethods.All;
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
exports.Middlewares = Middlewares;
