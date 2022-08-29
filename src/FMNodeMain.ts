import * as fs from "fs";
import { Server, createServer } from "http";
import * as path from "path";
import * as fg from "fast-glob";
// @ts-ignore
import * as RouteMap from "route-map";
import { Dictionary } from "./lib/types";
import HttpRequest from "./request";
import HttpResponse from "./response";

class FMNodeMain {
  private server: Server;
  private config: Dictionary = new Object();
  private sourceDir: string = "";
  private matchRoute: Function = new Function();
  private middlewares: Array<Function> = [];
  private onListen: Function = new Function();

  /**
   * Creates an instance of mine js.
   * @param [port]
   */
  constructor(port?: Number) {
    this.server = createServer();
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
      const _response = new HttpResponse(request, response);
      const _request = new HttpRequest(request, _response, this.config);
      // @ts-ignore
      _request.init(
        this.matchRoute,
        this.config,
        this.sourceDir,
        // @ts-ignore
        this.middlewares.middlewares
      );
    });
  }

  on(type: string, fun: Function) {
    if (type == "listen") {
      this.onListen = fun;
    }
  }

  /**
   * Listens mine js
   * @param [port]
   * @param [callback]
   */
  async init() {
    try {
      const data = fs.readFileSync("./settings.json");
      this.config = JSON.parse(data.toString());
    } catch (err) {
      throw err;
    }
    const stream = fg.sync(
      this.config.sourceDir.replace("./", "") + "/**/*.js",
      { onlyFiles: true, deep: 100 }
    );
    const routes: any = {};
    for await (const filepath of stream) {
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

      const requirePath = path.join(
        this.sourceDir,
        filepath.replace(this.config.sourceDir, "")
      );
      route = route.replace(this.config.sourceDir.replace("./", ""), "");
      routes[route] = require(requirePath);
    }
    this.matchRoute = RouteMap(routes);
    // Run Middleware
    const middlewarePath = path.join(
      this.sourceDir.toString(),
      this.config.middlewareDir,
      "index.js"
    );
    this.middlewares = require(middlewarePath)();
    // @ts-ignore
    this.server.listen(
      this.config.port ?? 5000,
      this.config.hostname ?? "localhost",
      () => {
        this.onListen(this.config.port ?? 5000);
      }
    );
  }
}

export default FMNodeMain;
