const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

async function comparePasswords(password, hash) {
  const passwordsMatched = await bcrypt.compare(password, hash);
  return passwordsMatched;
}

module.exports = {
  comparePasswords,
  hashPassword,
};
