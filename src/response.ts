import { RequestOptions, ServerResponse } from "http";
import * as fs from "fs";

class HttpResponse extends ServerResponse {
  private response: any;
  private request: any;
  public statusCode: number;
  public json: Function;
  constructor(request: any, response: any) {
    super(request);
    this.response = response;
    this.request = request;
    this.statusCode = 200;
    this.json = this.send;
  }

  status(status: number): HttpResponse {
    this.statusCode = status;
    return this;
  }

  send(data: string | object | Array<any>): void {
    if (typeof data === "string") {
      this.response.writeHead(this.statusCode, { "Content-Type": "text/html" });
      this.response.write(data);
    } else {
      this.response.writeHead(this.statusCode, { "Content-Type": "text/json" });
      this.response.write(JSON.stringify(data));
    }
    this.response.end();
  }

  serveStatic = (pathname: string, data: any) => {
    var isImage = 0,
      contentType,
      fileToLoad;
    var extension = pathname.split(".").pop();
    var file = "." + pathname;
    var dirs = pathname.split("/");
    if (pathname == "/static/") {
      file = "index.html";
      contentType = "text/html";
      isImage = 2;
    } else if (dirs[1] != "hidden" && pathname != "/app.js") {
      switch (extension) {
        case "jpg":
          contentType = "image/jpg";
          isImage = 1;
          break;
        case "png":
          contentType = "image/png";
          isImage = 1;
          break;
        case "js":
          contentType = "text/javascript";
          isImage = 2;
          break;
        case "css":
          contentType = "text/css";
          isImage = 2;
          break;
        case "html":
          contentType = "text/html";
          isImage = 2;
          break;
      }
    }

    if (isImage == 1) {
      this.response.writeHead(200, { "Content-Type": contentType });
      this.response.end(data, "binary");
    } else if (isImage == 2) {
      this.response.writeHead(200, { "Content-Type": contentType });
      this.response.write(data);
      this.response.end();
    }
  };

  sendError(err: string): void {
    const error = new Error(err);
    this.response.writeHead(this.statusCode, { "Content-Type": "text/html" });
    this.response.write("<pre>" + error.stack + "</pre>");
    this.response.end();
    console.log(error, "color: red");
  }

  routeNotFound() {
    this.send({
      error: true,
      message: `Route not found with ${this.request.method} Method`,
    });
  }
}

export default HttpResponse;
