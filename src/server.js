const app = require("./app");
const { port } = require("./config");

app
  .listen(3000, () => {
    console.log("Server running at: http://localhost:3000");
  })
  .on("error", (err) => {
    console.error(err);
  });
