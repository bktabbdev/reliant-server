const bcrypt = require("bcrypt");
const isEmail = require("validator/lib/isEmail");
const catchAsync = require("./catchAsync");

const Client = require("./../models/UserModel");
const AppError = require("./AppError");

exports.checkDuplicate = async (next, email) => {
  await Client.findAll({
    where: {
      email: email,
    },
  }).then((res) => {
    if (res.length > 0) {
      next(new AppError("RegistrationError: Email already exists", 404));
    }
  });
};

exports.checkPassword = (next, password, confirmPassword) => {
  let checker = true;
  if (password !== confirmPassword)
    next(new AppError("RegistrationError: Passwords do not match", 404));
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
};
