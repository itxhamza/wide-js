import * as url from "url";
import * as fs from "fs";
import { Dictionary } from "./lib/types";
import path = require("path");

/**
 * Http request
 */
class HttpRequest {
  private request: any;
  private response: any;
  // Routes
  public baseUrl: string;
  public originalUrl: string;
  public fullPath: string | null;
  public _parsedUrl: Dictionary;
  public protocol: string;
  public query: Dictionary = new Object();
  public params: Dictionary = new Object();
  private matchRoute: any;
  private config: Dictionary = new Object();

  /**
   * Creates an instance of http request.
   * @param request
   * @param response
   */
  constructor(request: any, response: any, config: any) {
    this.request = request;
    this.response = response;
    // URL Paths
    this.protocol = !!request.isSecure ? "https" : "http";
    this.fullPath = this.protocol + "://" + request.headers.host + request.url;
    this.originalUrl = request.url;
    this._parsedUrl = url.parse(this.fullPath);
    this.config = config;
    this.baseUrl = url.parse(this.fullPath).pathname ?? "";
  }

  isClass(func: any) {
    return (
      typeof func === "function" &&
      /^class\s/.test(Function.prototype.toString.call(func))
    );
  }

  /**
   * Next func
   * @param matchRoute
   */
  nextFunc(matchRoute: any): void {
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
    if (route.fn?.middleware) {
      route.fn.middleware(this, this.response, () => {
        this.runRequestMethods(route);
      });
    } else {
      this.runRequestMethods(route);
    }
  }

  runRequestMethods(route: any) {
    if (this.request.method === "GET" && route?.fn?.get) {
      this.sendRequest(route.fn.get);
    } else if (this.request.method === "POST" && route?.fn?.post) {
      this.sendRequest(route.fn.post);
    } else if (this.request.method === "PUT" && route?.fn?.put) {
      this.sendRequest(route.fn.put);
    } else if (this.request.method === "DELETE" && route?.fn?.delete) {
      this.sendRequest(route.fn.delete);
    } else if (route?.fn?.all) {
      this.sendRequest(route.fn.all);
    } else {
      this.serveStatic();
    }
  }

  sendRequest(fn: Function) {
    fn(this, this.response);
  }

  /**
   * Inits http request
   * @param routes
   * @returns init
   */
  init(
    matchRoute: Function,
    config: Dictionary,
    sourceDir: string,
    middlewares: Array<Dictionary>
  ): void {
    this.matchRoute = matchRoute;
    if (
      this.request.url &&
      this.request.url.split("/").pop() === "favicon.ico"
    ) {
      return this.response.status(204).send("");
    }

    const route = matchRoute(this.fullPath);
    this.params = route?.params ?? {};
    this.query = route?.qs ?? {};
    // return;
    if (this.hasMiddlewares(middlewares, matchRoute).includes(true)) {
      return;
    }
    if (route) {
      this.nextFunc(matchRoute);
    } else {
      this.serveStatic();
    }
  }

  hasMiddlewares(middlewares: Dictionary[], matchRoute: any) {
    const data = middlewares.map((item) => {
      if (item.method != "ALL" && item.method != undefined) {
        if (item.method !== this.request.method) return false;
      }
      if (item.path.toString().includes("*")) {
        let path = item.path.replace("*", "");
        const regex = new RegExp(`${path}[a-zA-Z0-9|\/]*`, "gm");
        let values = this.request.url.match(regex);
        if (!Array.isArray(values)) return false;
        for (let i = 0; i < values.length; i++) {
          if (values[i]) {
            item.fn(this, this.response, () => {
              this.nextFunc(matchRoute);
            });
            return true;
          }
        }
      } else {
        if (
          item.path.replaceAll("/", "") == this.request.url.replaceAll("/", "")
        ) {
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
    var pathname: any = url.parse(this.request.url).pathname;
    const matchPath =
      this.request.url.split("/").at(1) ===
      (this.config.publicPath.toString().at(0) == "/"
        ? this.config.publicPath.toString().replace("/", "").split("/").at(0)
        : this.config.publicPath.toString().split("/").at(0));

    if (matchPath) {
      try {
        const filePath = path.join(
          process.cwd().toString(),
          this.config.publicFolderDir,
          pathname.replace(this.config.publicPath, "")
        );
        const data = fs.readFileSync(filePath);
        this.response.serveStatic(pathname, data);
      } catch (err) {
        console.log(err);
        this.response.routeNotFound();
      }
      return;
    } else {
      this.response.routeNotFound();
    }
  }
}

export default HttpRequest;
