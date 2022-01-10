const app = require("./app");
const sequelize = require("./db/sequelize");

const port = process.env.PORT || 8080;

sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    console.log("SYNC SUCCESSFUL");
    app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });
  })
  .catch((err) => console.log(err.message));

// const server = app.listen(port, () => {
//   console.log(`App listening at http://localhost:${port}`);
// });
