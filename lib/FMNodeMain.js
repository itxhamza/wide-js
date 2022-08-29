"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const http_1 = require("http");
const path = require("path");
const fg = require("fast-glob");
// @ts-ignore
const RouteMap = require("route-map");
const request_1 = require("./request");
const response_1 = require("./response");
class FMNodeMain {
    /**
     * Creates an instance of mine js.
     * @param [port]
     */
    constructor(port) {
        this.config = new Object();
        this.sourceDir = "";
        this.matchRoute = new Function();
        this.middlewares = [];
        this.onListen = new Function();
        this.server = (0, http_1.createServer)();
        this.sourceDir = process.cwd();
        this.server.on("request", (request, response) => {
            // var body = "";
            // request.on("data", function (data: string) {
            //     body += data;
            // });
            // request.on("end", function () {
            //     body = JSON.parse(body);
            //     console.log(body);
            // });
            const _response = new response_1.default(request, response);
            const _request = new request_1.default(request, _response, this.config);
            // @ts-ignore
            _request.init(this.matchRoute, this.config, this.sourceDir, 
            // @ts-ignore
            this.middlewares.middlewares);
        });
    }
    on(type, fun) {
        if (type == "listen") {
            this.onListen = fun;
        }
    }
    /**
     * Listens mine js
     * @param [port]
     * @param [callback]
     */
    init() {
        var e_1, _a;
        var _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = fs.readFileSync("./settings.json");
                this.config = JSON.parse(data.toString());
            }
            catch (err) {
                throw err;
            }
            const stream = fg.sync(this.config.sourceDir.replace("./", "") + "/**/*.js", { onlyFiles: true, deep: 100 });
            const routes = {};
            try {
                for (var stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), !stream_1_1.done;) {
                    const filepath = stream_1_1.value;
                    let route = filepath;
                    const regex = /\[([^\]\[\r\n]*)\]/gm;
                    let m;
                    while ((m = regex.exec(route)) !== null) {
                        // This is necessary to avoid infinite loops with zero-width matches
                        if (m.index === regex.lastIndex) {
                            regex.lastIndex++;
                        }
                        route = route.replace(m[0], ":" + m[1]).replace(".js", "");
                    }
                    route = route.replace(".js", "");
                    route = route.replace("/index", "");
                    const requirePath = path.join(this.sourceDir, filepath.replace(this.config.sourceDir, ""));
                    route = route.replace(this.config.sourceDir.replace("./", ""), "");
                    routes[route] = require(requirePath);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (stream_1_1 && !stream_1_1.done && (_a = stream_1.return)) yield _a.call(stream_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.matchRoute = RouteMap(routes);
            // Run Middleware
            const middlewarePath = path.join(this.sourceDir.toString(), this.config.middlewareDir, "index.js");
            this.middlewares = require(middlewarePath)();
            // @ts-ignore
            this.server.listen((_b = this.config.port) !== null && _b !== void 0 ? _b : 5000, (_c = this.config.hostname) !== null && _c !== void 0 ? _c : "localhost", () => {
                var _a;
                this.onListen((_a = this.config.port) !== null && _a !== void 0 ? _a : 5000);
            });
        });
    }
}
exports.default = FMNodeMain;
