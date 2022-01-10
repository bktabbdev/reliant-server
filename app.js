const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv").config({ path: "./config.env" });

const helmet = require("helmet");

const app = express();
const cors = require("cors");

const authRouter = require("./routes/authRouter");
const adminRouter = require("./routes/adminRouter");

//enable cors
app.use(cors({ credentials: true }));
app.use(cookieParser());

//1) Global Middleware
//Set Security Http Headers
app.use(helmet());

//Development Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Limit Requests from Same API
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try again later!",
});
app.use("/api", limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
// app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use((req, res, next) => {
  // req.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);

app.get("/api", (req, res) => {
  res.json("hello world");
});

app.use((err, req, res, next) => {
  console.log("ERR.STACK: ", err.stack);
  res.status(err.statusCode).send({ err: err, message: err.message });
});

module.exports = app;
