import { FMNodeType } from "./lib/types";

class FMNode implements FMNodeType {
  get(req: any, res: any) {
    res.send({
      status: 404,
      message: "Get Method Not Implimented",
    });
    console.log(new Error("Get Method Not Implimented"));
  }

  post(req: any, res: any) {
    res.send({
      status: 404,
      message: "Post Method Not Implimented",
    });
    console.log(new Error("Post Method Not Implimented"));
  }

  put(req: any, res: any) {
    res.send({
      status: 404,
      message: "Put Method Not Implimented",
    });
    console.log(new Error("Put Method Not Implimented"));
  }

  delete(req: any, res: any) {
    res.send({
      status: 404,
      message: "Delete Method Not Implimented",
    });
    console.log(new Error("Delete Method Not Implimented"));
  }

  middleware(req: any, res: any, next: any) {
    next();
  }
}

export default FMNode;
