const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// exclude objext properties
const exclude = async (user, keys) => {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key))
  );
};

module.exports = {
  capitalizeFirstLetter,
  exclude,
};
