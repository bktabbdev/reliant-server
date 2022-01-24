const catchAsync = require("../../utils/catchAsync");
const Client = require("../../models/UserModel");
const AppError = require("../../utils/AppError");
const authApi = require("../../utils/auth");

exports.loginPost = catchAsync(async (req, res, next) => {
  console.log("login");
  const { email, password } = req.body.formData;
  try {
    if (email === "") return next(new AppError("Please enter your email", 422));
    if (password === "")
      return next(new AppError("Please enter your password", 422));
    //Find Account
    const user = await Client.findAll({
      where: {
        email: email,
      },
    });
    if (user.length === 0)
      return next(new AppError("Email not registered", 404));
    const hashedPassword = user[0].toJSON().password;

    let validatedPassword = await authApi.comparePassword(
      next,
      password,
      hashedPassword
    );

    if (validatedPassword) {
      authApi.createSendToken(user, 200, res);
    }
  } catch (err) {
    console.log(err);
    next(new AppError(`LOGINPOSTERROR: ${err.message} `, 500));
  }
});

exports.registerPost = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password, confirmPassword } =
    req.body.formData;
  if (
    firstName === "" ||
    lastName === "" ||
    email === "" ||
    password === "" ||
    confirmPassword === ""
  ) {
    return next(new AppError(`All fields must be entered`, 422));
  }
  try {
    //Check for Duplicates
    let validated = true;
    validated = await authApi.checkDuplicate(next, email);
    //Compare passwords
    validated = authApi.checkPassword(next, password, confirmPassword);
    const hashedPassword = await authApi.encryptPassword(next, password);

    console.log("validated: ", validated);

    if (validated === true) {
      await Client.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
      });
      res.status(201).send("Registration Successful! Redirecting to Login...");
    }
  } catch (err) {
    console.log("REGPOST ERROR: ", err);
  }
});
