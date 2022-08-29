const AuthMiddleware = (req, res, next) => {
  // res.send({
  //   request: "middleware",
  //   status: 200,
  // });
  next();
};

module.exports = AuthMiddleware;
