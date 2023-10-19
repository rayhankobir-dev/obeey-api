const bcrypt = require("bcrypt");

const makeHashed = (plainText) => {
  const salt = bcrypt.genSaltSync(10);
  const hashed = bcrypt.hashSync(plainText, salt);
  return {
    salt,
    hashed,
  };
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports = {
  makeHashed,
  capitalizeFirstLetter,
};
