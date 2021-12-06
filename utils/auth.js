const bcrypt = require("bcrypt");
const isEmail = require("validator/lib/isEmail");
const catchAsync = require("./catchAsync");
const jwt = require("jsonwebtoken");

const Client = require("./../models/UserModel");
const AppError = require("./AppError");
const app = require("../app");

const signToken = ({ ...data }) => {
  const { id } = data[0].dataValues;
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
  });
};

exports.createSendToken = (user, statusCode, res) => {
  const token = signToken(user);
  const { firstName, lastName, email, id } = user[0].dataValues;
  const cookieOptions = {
    // secure: true,
    // httpOnly: true,
    // sameSite: "lax",
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
    res.cookie("jwt", token);
  }
  if (process.env.NODE_ENV === "development") {
    res.status(statusCode).cookie("jwt", token, cookieOptions).json({
      status: "success",
      token: token,
      user: {
        firstName,
        lastName,
        id,
        email,
      },
    });
  }
};

exports.checkDuplicate = async (next, email) => {
  await Client.findAll({
    where: {
      email: email,
    },
  }).then((res) => {
    if (res.length > 0) {
      return next(new AppError("RegistrationError: Email already exists", 404));
    } else return true;
  });
};

exports.checkPassword = (next, password, confirmPassword) => {
  let checker = true;
  let error = null;
  if (password.length < 8)
    return next(new AppError("Passwords should be at least 8 characters", 422));
  if (password !== confirmPassword)
    return next(new AppError("RegistrationError: Passwords do not match", 422));
  return true;
};

exports.encryptPassword = async (next, password) => {
  console.log("ENCRYPT");
  const saltRounds = 12;

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    return next(new AppError("RegistrationError: EncryptionError"));
  }
};

exports.comparePassword = async (next, password, hashedPassword) => {
  try {
    let x = await bcrypt.compare(password, hashedPassword);

    if (!x) return next(new AppError("Wrong Password", 404));
    else return true;
  } catch (err) {
    console.log(err);
  }
};
