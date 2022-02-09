const app = require("./app");
const sequelize = require("./db/sequelize");

const port = process.env.PORT || 8080;

sequelize
  .sync()
  // .sync({ alter: true })
  // .sync({ force: true })
  .then(() => {
    console.log("SYNC SUCCESSFUL");
    process.on("uncaughtException", (err) => {
      console.log(err);
      console.log("server.js UNCAUGHT EXCEPTION");
      // process.exit(1);
    });
    app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

// const server = app.listen(port, () => {
//   console.log(`App listening at http://localhost:${port}`);
// });
