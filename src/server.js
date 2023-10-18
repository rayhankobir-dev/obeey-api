const app = require("./app");
const { port } = require("./config");
const Logger = require("./core/Logger");

app
  .listen(3000, () => {
    console.log("Server running at: http://localhost:3000");
    Logger.info(`Server running at port ${port}`);
  })
  .on("error", (err) => {
    console.error(err);
  });
