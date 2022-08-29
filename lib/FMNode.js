"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FMNode {
    get(req, res) {
        res.send({
            status: 404,
            message: "Get Method Not Implimented",
        });
        console.log(new Error("Get Method Not Implimented"));
    }
    post(req, res) {
        res.send({
            status: 404,
            message: "Post Method Not Implimented",
        });
        console.log(new Error("Post Method Not Implimented"));
    }
    put(req, res) {
        res.send({
            status: 404,
            message: "Put Method Not Implimented",
        });
        console.log(new Error("Put Method Not Implimented"));
    }
    delete(req, res) {
        res.send({
            status: 404,
            message: "Delete Method Not Implimented",
        });
        console.log(new Error("Delete Method Not Implimented"));
    }
    middleware(req, res, next) {
        next();
    }
}
exports.default = FMNode;
