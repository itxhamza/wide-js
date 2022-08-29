const qs = require("node:querystring");
function get(req, res) {
  res.status(201).send({
    success: true,
    message: "From Create/Index.js File",
    params: req.params ?? [],
  });
}

function post(req, res) {
  res.end("post method");
}

function put(req, res) {
  res.end("put method");
}

function destroy(req, res) {
  res.end("delete method");
}

module.exports = {
  get,
  post,
  put,
  destroy,
};
