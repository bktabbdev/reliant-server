const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv").config({ path: "./config.env" });

const helmet = require("helmet");

const app = express();

const authRouter = require("./routes/router");

//1) Global Middleware
//Set Security Http Headers
app.use(helmet());

//Development Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Limit Requests from Same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try again later!",
});
app.use("/api", limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.json("hello world");
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json("Something broke");
});

module.exports = app;
