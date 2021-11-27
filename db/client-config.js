const { Client, Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "postgres",
  database: "reliant",
  port: 5432,
  host: "localhost",
});

module.exports = pool;
