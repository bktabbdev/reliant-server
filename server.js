const app = require("./app");
const dotenv = require("dotenv").config({ path: "./config.env" });

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`App listening at http://localhost:8080`);
});
