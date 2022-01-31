const multer = require("multer");
const AppError = require("./utils/AppError");
// const upload = multer({ dest: "public/uploads/trainings" });
const utility = require("./utils/util.multer");
const Training = require("./models/TrainingModel");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/trainings");
  },
  filename: async (req, file, cb) => {
    const nameStr = JSON.parse(req.body.training).company.companyName.trim();
    const name = utility.slugifyCompName(nameStr);
    const uniqueSuffix = ".pdf";
    cb(null, name + uniqueSuffix);
  },
});

const upload = multer({ storage: multerStorage });

module.exports = upload;
