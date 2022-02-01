const slugify = require("slugify");

exports.slugifyCompName = (str) => {
  let name = slugify(str, { strict: true, lower: true });
  console.log(name);
  return name;
};

exports.newTrainingPath = (comp, type, num, ext) => {
  const compName = this.slugifyCompName(comp);
  const newPath = compName + "_" + type + "_" + num + ext;
  console.log(newPath);
  return newPath;
};

exports.validateTrainingForm = () => {};
