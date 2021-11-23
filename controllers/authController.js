const catchAsync = require("./../utils/catchAsync");

exports.loginPost = catchAsync(async (req, res, next) => {
  try {
    console.log(req);
    res.send("complete");
  } catch (err) {}
});
