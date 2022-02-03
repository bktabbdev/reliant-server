const multer = require("multer");
const AppError = require("./utils/AppError");
// const upload = multer({ dest: "public/uploads/trainings" });
const utility = require("./utils/util.string");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/trainings");
  },
  filename: async (req, file, cb) => {
    cb(null, "tempName.pdf");
  },
});

const upload = multer({ storage: multerStorage });

module.exports = upload;
