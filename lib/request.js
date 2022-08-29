"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
const fs = require("fs");
const path = require("path");
/**
 * Http request
 */
class HttpRequest {
    /**
     * Creates an instance of http request.
     * @param request
     * @param response
     */
    constructor(request, response, config) {
        var _a;
        this.query = new Object();
        this.params = new Object();
        this.config = new Object();
        this.request = request;
        this.response = response;
        // URL Paths
        this.protocol = !!request.isSecure ? "https" : "http";
        this.fullPath = this.protocol + "://" + request.headers.host + request.url;
        this.originalUrl = request.url;
        this._parsedUrl = url.parse(this.fullPath);
        this.config = config;
        this.baseUrl = (_a = url.parse(this.fullPath).pathname) !== null && _a !== void 0 ? _a : "";
    }
    isClass(func) {
        return (typeof func === "function" &&
            /^class\s/.test(Function.prototype.toString.call(func)));
    }
    /**
     * Next func
     * @param matchRoute
     */
    nextFunc(matchRoute) {
        var _a;
        const route = matchRoute(this.fullPath);
        if (!route) {
            this.serveStatic();
            return;
        }
        if (this.isClass(route.fn)) {
            const fmComp = new route.fn();
            route.fn = {
                get: fmComp.get,
                post: fmComp.post,
                put: fmComp.put,
                delete: fmComp.delete,
                middleware: fmComp.middleware,
            };
            // this.response.routeNotFound();
        }
        if ((_a = route.fn) === null || _a === void 0 ? void 0 : _a.middleware) {
            route.fn.middleware(this, this.response, () => {
                this.runRequestMethods(route);
            });
        }
        else {
            this.runRequestMethods(route);
        }
    }
    runRequestMethods(route) {
        var _a, _b, _c, _d, _e;
        if (this.request.method === "GET" && ((_a = route === null || route === void 0 ? void 0 : route.fn) === null || _a === void 0 ? void 0 : _a.get)) {
            this.sendRequest(route.fn.get);
        }
        else if (this.request.method === "POST" && ((_b = route === null || route === void 0 ? void 0 : route.fn) === null || _b === void 0 ? void 0 : _b.post)) {
            this.sendRequest(route.fn.post);
        }
        else if (this.request.method === "PUT" && ((_c = route === null || route === void 0 ? void 0 : route.fn) === null || _c === void 0 ? void 0 : _c.put)) {
            this.sendRequest(route.fn.put);
        }
        else if (this.request.method === "DELETE" && ((_d = route === null || route === void 0 ? void 0 : route.fn) === null || _d === void 0 ? void 0 : _d.delete)) {
            this.sendRequest(route.fn.delete);
        }
        else if ((_e = route === null || route === void 0 ? void 0 : route.fn) === null || _e === void 0 ? void 0 : _e.all) {
            this.sendRequest(route.fn.all);
        }
        else {
            this.serveStatic();
        }
    }
    sendRequest(fn) {
        fn(this, this.response);
    }
    /**
     * Inits http request
     * @param routes
     * @returns init
     */
    init(matchRoute, config, sourceDir, middlewares) {
        var _a, _b;
        this.matchRoute = matchRoute;
        if (this.request.url &&
            this.request.url.split("/").pop() === "favicon.ico") {
            return this.response.status(204).send("");
        }
        const route = matchRoute(this.fullPath);
        this.params = (_a = route === null || route === void 0 ? void 0 : route.params) !== null && _a !== void 0 ? _a : {};
        this.query = (_b = route === null || route === void 0 ? void 0 : route.qs) !== null && _b !== void 0 ? _b : {};
        // return;
        if (this.hasMiddlewares(middlewares, matchRoute).includes(true)) {
            return;
        }
        if (route) {
            this.nextFunc(matchRoute);
        }
        else {
            this.serveStatic();
        }
    }
    hasMiddlewares(middlewares, matchRoute) {
        const data = middlewares.map((item) => {
            if (item.method != "ALL" && item.method != undefined) {
                if (item.method !== this.request.method)
                    return false;
            }
            if (item.path.toString().includes("*")) {
                let path = item.path.replace("*", "");
                const regex = new RegExp(`${path}[a-zA-Z0-9|\/]*`, "gm");
                let values = this.request.url.match(regex);
                if (!Array.isArray(values))
                    return false;
                for (let i = 0; i < values.length; i++) {
                    if (values[i]) {
                        item.fn(this, this.response, () => {
                            this.nextFunc(matchRoute);
                        });
                        return true;
                    }
                }
            }
            else {
                if (item.path.replaceAll("/", "") == this.request.url.replaceAll("/", "")) {
                    item.fn(this, this.response, () => {
                        this.nextFunc(matchRoute);
                    });
                    return true;
                }
            }
        });
        return data;
    }
    serveStatic() {
        var pathname = url.parse(this.request.url).pathname;
        const matchPath = this.request.url.split("/").at(1) ===
            (this.config.publicPath.toString().at(0) == "/"
                ? this.config.publicPath.toString().replace("/", "").split("/").at(0)
                : this.config.publicPath.toString().split("/").at(0));
        if (matchPath) {
            try {
                const filePath = path.join(process.cwd().toString(), this.config.publicFolderDir, pathname.replace(this.config.publicPath, ""));
                const data = fs.readFileSync(filePath);
                this.response.serveStatic(pathname, data);
            }
            catch (err) {
                console.log(err);
                this.response.routeNotFound();
            }
            return;
        }
        else {
            this.response.routeNotFound();
        }
    }
}
exports.default = HttpRequest;
