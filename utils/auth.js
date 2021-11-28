const bcrypt = require("bcrypt");
const isEmail = require("validator/lib/isEmail");
const catchAsync = require("./catchAsync");

const Client = require("./../models/UserModel");
const AppError = require("./AppError");
const app = require("../app");

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
  let x = await bcrypt.compare(password, hashedPassword);
  if (x === false) return next(new AppError("Passwords do not match"), 404);
  else return true;
};
