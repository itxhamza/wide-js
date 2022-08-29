const get = (req, res) => {
  res.status(200).json({
    testing: true,
    path: req.fullPath,
    parsedURL: req._parsedUrl,
    query: req.query,
    params: req.params,
  });
};

get.middleware = (req, res, next) => {
  next();
};

module.exports = {
  get,
};

// const { FMNode } = require("@itxhamza/fwk-node");

// class Methods extends FMNode {
//   get(req, res) {
//     res.send({
//       status: 200,
//       params: req.params,
//     });
//   }
//   middleware(req, res, next) {
//     console.log("Middleware Testing Function");
//     next();
//   }
// }

// module.exports = Methods;
