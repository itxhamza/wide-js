const { Middlewares, RequestMethods } = require("@itxhamza/fwk-node");
const AuthMiddleware = require("./auth.middleware");

module.exports = () => {
  const middlewares = new Middlewares();
  middlewares.register(AuthMiddleware).forRoutes([
    {
      path: "/*",
      method: RequestMethods.All,
    },
    {
      path: "/testing/package",
      method: RequestMethods.All,
    },
  ]);

  return middlewares;
};
