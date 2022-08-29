const { default: FMNode } = require("@itxhamza/fwk-node");
const path = require("path");

const bootstrap = () => {
  const fm = new FMNode();
  fm.on("listen", (port) => {
    console.log("Function running on Port No. " + port);
  });
  fm.init();
};

bootstrap();
