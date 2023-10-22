const bcrypt = require("bcrypt");

const makeHashed = async (plainText) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(plainText, salt);
  return {
    hashed,
    salt,
  };
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports = {
  makeHashed,
  capitalizeFirstLetter,
};
