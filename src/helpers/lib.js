const bcrypt = require("bcrypt");

const makeHashed = (plainText) => {
  const salt = bcrypt.genSaltSync(10);
  const hashed = bcrypt.hashSync(plainText, salt);
  return {
    salt,
    hashed,
  };
};

module.exports = {
  makeHashed,
};
