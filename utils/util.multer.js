const slugify = require("slugify");

exports.slugifyCompName = (str) => {
  let name = slugify(str, { strict: true, lower: true });
  console.log(name);
  return name;
};
