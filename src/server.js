const app = require("./app");

app
  .listen(3000, () => {
    console.log("Server running at: http://localhost:3000");
  })
  .on("error", (err) => {
    console.error(err);
  });
