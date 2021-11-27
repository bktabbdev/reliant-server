const catchAsync = require("./../utils/catchAsync");
const pool = require("./../db/client-config");
const Client = require("./../models/UserModel");
const AppError = require("./../utils/AppError");
const authApi = require("./../utils/auth");
const { userInfo } = require("os");

exports.loginPost = catchAsync(async (req, res, next) => {
  const { email, password } = req.body.data;
  try {
    //Find Account
    const user = await Client.findAll({
      where: {
        email: email,
      },
    });
    if (user.length === 0)
      return next(new AppError("Email not registered", 404));
    // const hashedPassword = user[0].toJSON().password;
    console.log(user);

    // await authApi.comparePassword(next, password, hashedPassword);

    res.status(201).json({
      message: "Successfully Logged In!",
    });
  } catch (err) {
    next(new AppError(`${err} `, 404));
  }
});

exports.registerPost = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password, confirmPassword } =
    req.body.data;
  try {
    //Check for Duplicates
    authApi.checkDuplicate(next, email);
    //Compare passwords
    authApi.checkPassword(next, password, confirmPassword);
    const hashedPassword = await authApi.encryptPassword(next, password);
    await Client.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });
    res.status(201).send("Registration Successful!");
  } catch (err) {
    console.log("REGPOST ERROR: ", err);
  }
});
