const get = (req, res) => {
  res.status(200).json({
    testing: true,
    path: req.fullPath,
    parsedURL: req._parsedUrl,
    query: req.query,
    params: req.params,
  });
};

const middleware = (req, res, next) => {
  console.log("middleware static function");
  next();
};

module.exports = {
  get,
  middleware,
};
